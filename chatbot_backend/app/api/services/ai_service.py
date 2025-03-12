import openai
from app.core.config import settings

openai.api_key = settings.OPENAI_API_KEY

class AIService:
    async def generate_response(self, conversation_history):
        """Generate a response using GPT-4"""
        try:
            messages = [
                {"role": msg["role"], "content": msg["content"]} 
                for msg in conversation_history
            ]
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return "I'm sorry, I'm having trouble processing your request right now."