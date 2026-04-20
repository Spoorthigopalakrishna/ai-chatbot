import { useState, useCallback, useEffect } from 'react';
import { Message } from '../types';
import { faqs } from '../data/faqs';

const STORAGE_KEY = 'ai_chat_messages';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    return [
      {
        id: '1',
        content: "Hello! I'm your AI Support Assistant. How can I help you today?\n\nYou can ask me about:\n- Account Management\n- Billing & Subscriptions\n- Technical Support\n- Product Features",
        role: 'assistant',
        timestamp: new Date(),
      },
    ];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const findBestMatch = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    
    // Simple RAG-like matching
    const scores = faqs.map(faq => {
      const question = faq.question.toLowerCase();
      const category = faq.category.toLowerCase();
      
      let score = 0;
      const queryWords = normalizedQuery.split(/\W+/);
      
      queryWords.forEach(word => {
        if (word.length < 3) return;
        if (question.includes(word)) score += 2;
        if (category.includes(word)) score += 1;
      });

      return { faq, score };
    });

    const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

    if (bestMatch.score > 0) {
      return bestMatch.faq.answer;
    }

    return "I'm not quite sure about that specific request. Could you try rephrasing it? I can help with account issues, billing, and general technical support.";
  };

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        const botResponse = findBestMatch(content);
        
        const botMessage: Message = {
          id: crypto.randomUUID(),
          content: botResponse,
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error processing message:', error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 1000 + Math.random() * 1000);
  }, []);

  const clearChat = useCallback(() => {
    const initialMessage: Message = {
      id: crypto.randomUUID(),
      content: "Hello! I'm your AI Support Assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const submitFeedback = useCallback((messageId: string, isHelpful: boolean) => {
    console.log('Feedback submitted:', { messageId, isHelpful });
    // In a real app, this would be an API call
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    submitFeedback,
    clearChat,
  };
}