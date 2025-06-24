import fal_client
from typing import Dict, Any, Optional
import asyncio
from app.config import settings

# Configure Fal client
fal_client.api_key = settings.FAL_KEY

class FalService:
    @staticmethod
    async def generate_image(
        model: str,
        prompt: str,
        negative_prompt: Optional[str] = None,
        width: int = 1024,
        height: int = 1024,
        num_images: int = 1,
        guidance_scale: float = 7.5,
        num_inference_steps: int = 50,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate image using Fal.ai"""
        try:
            # Prepare arguments based on model
            args = {
                "prompt": prompt,
                "image_size": {"width": width, "height": height},
                "num_images": num_images,
                "guidance_scale": guidance_scale,
                "num_inference_steps": num_inference_steps,
            }
            
            if negative_prompt:
                args["negative_prompt"] = negative_prompt
                
            # Add any additional kwargs
            args.update(kwargs)
            
            # Submit the request
            result = await asyncio.to_thread(
                fal_client.submit,
                model,
                arguments=args
            )
            
            return {
                "request_id": result.request_id,
                "status": "submitted"
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate image: {str(e)}")
    
    @staticmethod
    async def generate_video(
        model: str,
        prompt: str,
        duration: int = 5,
        fps: int = 24,
        width: int = 1024,
        height: int = 576,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate video using Fal.ai"""
        try:
            args = {
                "prompt": prompt,
                "duration": duration,
                "fps": fps,
                "resolution": {"width": width, "height": height},
            }
            
            # Add any additional kwargs
            args.update(kwargs)
            
            # Submit the request
            result = await asyncio.to_thread(
                fal_client.submit,
                model,
                arguments=args
            )
            
            return {
                "request_id": result.request_id,
                "status": "submitted"
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate video: {str(e)}")
    
    @staticmethod
    async def get_result(request_id: str) -> Dict[str, Any]:
        """Get result from Fal.ai request"""
        try:
            result = await asyncio.to_thread(
                fal_client.result,
                request_id
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to get result: {str(e)}")
    
    @staticmethod
    async def get_status(request_id: str) -> Dict[str, Any]:
        """Get status of Fal.ai request"""
        try:
            status = await asyncio.to_thread(
                fal_client.status,
                request_id
            )
            return status
        except Exception as e:
            raise Exception(f"Failed to get status: {str(e)}")