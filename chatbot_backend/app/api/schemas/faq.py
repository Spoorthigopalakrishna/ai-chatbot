from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class FAQBase(BaseModel):
    question: str = Field(..., description="The question text")
    answer: str = Field(..., description="The answer text")
    keywords: Optional[str] = Field(None, description="Comma-separated keywords related to this FAQ")

class FAQCreate(FAQBase):
    pass

class FAQUpdate(BaseModel):
    question: Optional[str] = Field(None, description="The question text")
    answer: Optional[str] = Field(None, description="The answer text")
    keywords: Optional[str] = Field(None, description="Comma-separated keywords related to this FAQ")

class FAQResponse(FAQBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class FAQSearchQuery(BaseModel):
    query: str = Field(..., description="Search query text")
    limit: int = Field(10, description="Maximum number of results to return")

class FAQSearchResponse(BaseModel):
    results: List[FAQResponse]
    total: int
    query: str