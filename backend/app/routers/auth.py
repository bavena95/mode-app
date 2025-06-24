from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter()

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    avatar_url: str
    is_premium: bool

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user information"""
    result = await db.execute(
        select(User).where(User.stack_user_id == current_user["id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        # Create user if doesn't exist
        user = User(
            stack_user_id=current_user["id"],
            email=current_user.get("email", ""),
            username=current_user.get("username", ""),
            full_name=current_user.get("display_name", ""),
            avatar_url=current_user.get("profile_image_url", "")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username or "",
        full_name=user.full_name or "",
        avatar_url=user.avatar_url or "",
        is_premium=user.is_premium
    )

@router.post("/sync")
async def sync_user(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sync user data from Stack Auth"""
    result = await db.execute(
        select(User).where(User.stack_user_id == current_user["id"])
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Update existing user
        user.email = current_user.get("email", user.email)
        user.username = current_user.get("username", user.username)
        user.full_name = current_user.get("display_name", user.full_name)
        user.avatar_url = current_user.get("profile_image_url", user.avatar_url)
    else:
        # Create new user
        user = User(
            stack_user_id=current_user["id"],
            email=current_user.get("email", ""),
            username=current_user.get("username", ""),
            full_name=current_user.get("display_name", ""),
            avatar_url=current_user.get("profile_image_url", "")
        )
        db.add(user)
    
    await db.commit()
    return {"message": "User synced successfully"}