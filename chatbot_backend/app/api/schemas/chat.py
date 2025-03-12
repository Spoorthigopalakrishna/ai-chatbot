from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MessageBase(BaseModel):
    content: str = Field(..., description="The content of the message")

class MessageCreate(MessageBase):
    conversation_id: Optional[int] = Field(None, description="ID of the conversation")
    role: str = Field("user", description="Role of the message sender (user or assistant)")
    user_identifier: Optional[str] = Field(None, description="Identifier for the user if starting a new conversation")
    platform: Optional[str] = Field("web", description="Platform the message was sent from")

class MessageResponse(MessageBase):
    id: int
    conversation_id: int
    role: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class ConversationBase(BaseModel):
    user_identifier: str = Field(..., description="Identifier for the user")
    platform: str = Field(..., description="Platform the conversation is on")

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []
    
    class Config:
        orm_mode = True

class FeedbackBase(BaseModel):
    is_helpful: bool = Field(..., description="Whether the message was helpful")
    comment: Optional[str] = Field(None, description="Optional comment on the message")

class FeedbackCreate(FeedbackBase):
    message_id: int = Field(..., description="ID of the message being rated")

class FeedbackResponse(FeedbackBase):
    id: int
    message_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True