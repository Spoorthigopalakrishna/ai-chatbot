from typing import Dict, List, Optional, Tuple
import datetime
from uuid import uuid4
import logging

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self, db_client, ai_service):
        """
        Initialize the chat service with database client and AI service.
        
        Args:
            db_client: Database client for storing chat history and querying FAQs
            ai_service: AI service for enhancing responses
        """
        self.db_client = db_client
        self.ai_service = ai_service
        
    async def get_response(self, user_id: str, message: str, conversation_id: Optional[str] = None) -> Dict:
        """
        Process user message and generate a response.
        
        Args:
            user_id: Unique identifier for the user
            message: User's message text
            conversation_id: ID of the ongoing conversation, or None for a new conversation
            
        Returns:
            Dict containing the response and conversation metadata
        """
        # Create a new conversation if needed
        if not conversation_id:
            conversation_id = str(uuid4())
            await self._create_conversation(user_id, conversation_id)
        
        # Log the user message
        await self._log_message(conversation_id, "user", message)
        
        # Try to find an answer in the FAQ database first
        faq_answer = await self._find_faq_match(message)
        
        if faq_answer:
            response_text = faq_answer
            response_source = "faq"
        else:
            # Get conversation history for context
            conversation_history = await self._get_conversation_history(conversation_id, limit=5)
            
            # Use AI to generate a response
            response_text = await self.ai_service.generate_response(message, conversation_history)
            response_source = "ai"
        
        # Log the bot response
        await self._log_message(conversation_id, "bot", response_text)
        
        return {
            "conversation_id": conversation_id,
            "response": response_text,
            "source": response_source,
            "timestamp": datetime.datetime.now().isoformat()
        }
    
    async def _create_conversation(self, user_id: str, conversation_id: str) -> None:
        """Create a new conversation record in the database."""
        await self.db_client.conversations.insert_one({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now()
        })
    
    async def _log_message(self, conversation_id: str, sender: str, content: str) -> None:
        """Log a message to the conversation history."""
        await self.db_client.messages.insert_one({
            "conversation_id": conversation_id,
            "sender": sender,  # 'user' or 'bot'
            "content": content,
            "timestamp": datetime.datetime.now()
        })
        
        # Update the conversation's updated_at timestamp
        await self.db_client.conversations.update_one(
            {"conversation_id": conversation_id},
            {"$set": {"updated_at": datetime.datetime.now()}}
        )
    
    async def _get_conversation_history(self, conversation_id: str, limit: int = 5) -> List[Dict]:
        """Retrieve recent conversation history."""
        cursor = self.db_client.messages.find(
            {"conversation_id": conversation_id}
        ).sort("timestamp", -1).limit(limit)
        
        # Convert to list and reverse to get chronological order
        messages = await cursor.to_list(length=limit)
        messages.reverse()
        
        return messages
    
    async def _find_faq_match(self, query: str) -> Optional[str]:
        """
        Find the best matching FAQ for the user query.
        
        Args:
            query: User's question
            
        Returns:
            Answer text if a match is found, None otherwise
        """
        # Use keyword matching to find relevant FAQs
        keywords = self._extract_keywords(query)
        
        if not keywords:
            return None
        
        # Query the database for matching FAQs
        cursor = self.db_client.faqs.find({
            "$text": {"$search": " ".join(keywords)}
        }).sort([("score", {"$meta": "textScore"})]).limit(1)
        
        faq = await cursor.to_list(length=1)
        
        if faq and len(faq) > 0:
            # Log that we found an FAQ match
            logger.info(f"Found FAQ match for query: {query}")
            return faq[0]["answer"]
        
        return None
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from the user's query."""
        # Simple implementation - split by spaces and remove common words
        common_words = {"the", "a", "an", "in", "on", "at", "is", "are", "was", "were", "and", "or", "but", "for", "with"}
        words = text.lower().split()
        return [word for word in words if word not in common_words]
    
    async def save_feedback(self, conversation_id: str, message_id: str, helpful: bool) -> None:
        """Save user feedback about a response."""
        await self.db_client.feedback.insert_one({
            "conversation_id": conversation_id,
            "message_id": message_id,
            "helpful": helpful,
            "timestamp": datetime.datetime.now()
        })
        
        # Log the feedback
        logger.info(f"Feedback received: message_id={message_id}, helpful={helpful}")

