from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import jwt
from app.config import settings

security = HTTPBearer()

async def verify_stack_auth_token(token: str) -> dict:
    """Verify Stack Auth token with their API"""
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Stack-Project-Id": settings.STACK_AUTH_PROJECT_ID,
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.stack-auth.com/api/v1/users/me",
                headers=headers
            )
            
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
            
        return response.json()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify and decode the authentication token"""
    token = credentials.credentials
    user_data = await verify_stack_auth_token(token)
    return user_data

async def get_current_user(user_data: dict = Depends(verify_token)) -> dict:
    """Get current authenticated user"""
    return user_data