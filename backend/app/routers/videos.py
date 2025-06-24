from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.generation import Generation
from app.models.user import User
from app.schemas.generation import VideoGenerationRequest, GenerationResponse
from app.services.fal_service import FalService

router = APIRouter()

@router.post("/generate", response_model=GenerationResponse)
async def generate_video(
    request: VideoGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate a video using AI"""
    try:
        # Get user from database
        result = await db.execute(
            select(User).where(User.stack_user_id == current_user["id"])
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Submit to Fal.ai
        fal_result = await FalService.generate_video(
            model=request.model,
            prompt=request.prompt,
            duration=request.duration,
            fps=request.fps,
            width=request.width,
            height=request.height
        )
        
        # Create generation record
        generation = Generation(
            user_id=user.id,
            project_id=request.project_id,
            generation_type="video",
            model_name=request.model,
            prompt=request.prompt,
            fal_request_id=fal_result["request_id"],
            status="processing"
        )
        
        db.add(generation)
        await db.commit()
        await db.refresh(generation)
        
        return GenerationResponse(
            id=generation.id,
            request_id=generation.fal_request_id,
            status=generation.status,
            generation_type=generation.generation_type,
            model_name=generation.model_name,
            prompt=generation.prompt,
            created_at=generation.created_at
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate video: {str(e)}"
        )

@router.get("/generations", response_model=List[GenerationResponse])
async def get_user_video_generations(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's video generations"""
    result = await db.execute(
        select(User).where(User.stack_user_id == current_user["id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == user.id)
        .where(Generation.generation_type == "video")
        .order_by(Generation.created_at.desc())
    )
    generations = result.scalars().all()
    
    return [
        GenerationResponse(
            id=gen.id,
            request_id=gen.fal_request_id,
            status=gen.status,
            generation_type=gen.generation_type,
            model_name=gen.model_name,
            prompt=gen.prompt,
            result_url=gen.result_url,
            error_message=gen.error_message,
            created_at=gen.created_at,
            completed_at=gen.completed_at
        )
        for gen in generations
    ]