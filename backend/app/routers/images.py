from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.generation import Generation
from app.models.user import User
from app.schemas.generation import ImageGenerationRequest, GenerationResponse
from app.services.fal_service import FalService

router = APIRouter()

@router.post("/generate", response_model=GenerationResponse)
async def generate_image(
    request: ImageGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate an image using AI"""
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
        fal_result = await FalService.generate_image(
            model=request.model,
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            width=request.width,
            height=request.height,
            num_images=request.num_images,
            guidance_scale=request.guidance_scale,
            num_inference_steps=request.num_inference_steps
        )
        
        # Create generation record
        generation = Generation(
            user_id=user.id,
            project_id=request.project_id,
            generation_type="image",
            model_name=request.model,
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            fal_request_id=fal_result["request_id"],
            status="processing"
        )
        
        db.add(generation)
        await db.commit()
        await db.refresh(generation)
        
        # Add background task to check status
        background_tasks.add_task(check_generation_status, generation.id, db)
        
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
            detail=f"Failed to generate image: {str(e)}"
        )

@router.get("/generations", response_model=List[GenerationResponse])
async def get_user_generations(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's image generations"""
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
        .where(Generation.generation_type == "image")
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

@router.get("/generations/{generation_id}/status")
async def get_generation_status(
    generation_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get status of a specific generation"""
    result = await db.execute(
        select(Generation).where(Generation.id == generation_id)
    )
    generation = result.scalar_one_or_none()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    # Check if user owns this generation
    user_result = await db.execute(
        select(User).where(User.stack_user_id == current_user["id"])
    )
    user = user_result.scalar_one_or_none()
    
    if not user or generation.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # If still processing, check Fal.ai status
    if generation.status == "processing":
        try:
            fal_status = await FalService.get_status(generation.fal_request_id)
            if fal_status.get("status") == "completed":
                fal_result = await FalService.get_result(generation.fal_request_id)
                generation.result_url = fal_result.get("images", [{}])[0].get("url")
                generation.status = "completed"
                await db.commit()
        except Exception:
            pass
    
    return {
        "id": generation.id,
        "status": generation.status,
        "result_url": generation.result_url,
        "error_message": generation.error_message
    }

async def check_generation_status(generation_id: int, db: AsyncSession):
    """Background task to check generation status"""
    # This would be implemented to periodically check status
    pass