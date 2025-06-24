from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Generation(Base):
    __tablename__ = "generations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    generation_type = Column(String, nullable=False)  # 'image', 'video'
    model_name = Column(String, nullable=False)
    prompt = Column(Text, nullable=False)
    negative_prompt = Column(Text)
    parameters = Column(Text)  # JSON string of generation parameters
    result_url = Column(String)
    fal_request_id = Column(String)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    error_message = Column(Text)
    processing_time = Column(Float)
    cost = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    user = relationship("User")
    project = relationship("Project")