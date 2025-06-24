from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class ImageGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=2000)
    negative_prompt: Optional[str] = Field(None, max_length=1000)
    model: str = Field(default="fal-ai/flux/schnell")
    width: int = Field(default=1024, ge=256, le=2048)
    height: int = Field(default=1024, ge=256, le=2048)
    num_images: int = Field(default=1, ge=1, le=4)
    guidance_scale: float = Field(default=7.5, ge=1.0, le=20.0)
    num_inference_steps: int = Field(default=50, ge=10, le=100)
    project_id: Optional[int] = None

class VideoGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=2000)
    model: str = Field(default="fal-ai/runway-gen3/turbo/image-to-video")
    duration: int = Field(default=5, ge=1, le=10)
    fps: int = Field(default=24, ge=12, le=30)
    width: int = Field(default=1024, ge=256, le=1920)
    height: int = Field(default=576, ge=256, le=1080)
    project_id: Optional[int] = None

class GenerationResponse(BaseModel):
    id: int
    request_id: str
    status: str
    generation_type: str
    model_name: str
    prompt: str
    result_url: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

class GenerationStatusResponse(BaseModel):
    id: int
    status: str
    result_url: Optional[str] = None
    error_message: Optional[str] = None
    progress: Optional[float] = None