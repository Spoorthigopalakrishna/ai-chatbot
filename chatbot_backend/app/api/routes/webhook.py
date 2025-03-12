from fastapi import APIRouter, Request, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict

from app.db.session import get_db
from app.services.twilio_service import TwilioService
from app.services.chat_service import ChatService
from app.core.config import settings

router = APIRouter()
twilio_service = TwilioService()
chat_service = ChatService()

@router.post("/twilio/whatsapp")
async def twilio_whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook endpoint for Twilio WhatsApp messages
    Receives incoming WhatsApp messages and sends chatbot responses
    """
    # Verify the request is coming from Twilio
    form_data = await request.form()
    
    # Extract message data
    message_sid = form_data.get("MessageSid")
    from_number = form_data.get("From")
    body = form_data.get("Body", "")
    
    if not message_sid or not from_number:
        raise HTTPException(status_code=400, detail="Invalid webhook data")
    
    # Process the incoming message
    try:
        # Create or get conversation for this user
        conversation = chat_service.get_or_create_conversation(
            db, 
            user_identifier=from_number,
            platform="whatsapp"
        )
        
        # Add user message to conversation
        chat_service.add_message(
            db,
            conversation_id=conversation.id,
            role="user",
            content=body
        )
        
        # Generate bot response
        response = await chat_service.generate_response(db, conversation.id)
        
        # Send response back via Twilio
        twilio_service.send_whatsapp_message(
            to_number=from_number,
            message=response.content
        )
        
        return {"status": "success", "message": "Message processed"}
        
    except Exception as e:
        # Log the error
        print(f"Error processing WhatsApp message: {e}")
        
        # Send a generic error message to the user
        twilio_service.send_whatsapp_message(
            to_number=from_number,
            message="I'm sorry, I'm having trouble processing your message right now. Please try again later."
        )
        
        return {"status": "error", "message": str(e)}

@router.post("/twilio/status")
async def twilio_status_callback(status_data: Dict = Body(...), db: Session = Depends(get_db)):
    """
    Callback endpoint for Twilio message status updates
    Useful for tracking delivery status of messages
    """
    message_sid = status_data.get("MessageSid")
    message_status = status_data.get("MessageStatus")
    
    # Log status update
    print(f"Message {message_sid} status: {message_status}")
    
    # Can be stored in database for analytics/troubleshooting
    # twilio_service.update_message_status(db, message_sid, message_status)
    
    return {"status": "received"}

@router.get("/health")
def webhook_health_check():
    """Health check endpoint for webhook monitoring"""
    return {"status": "ok", "service": "chatbot-webhook"}