import React, { useState } from 'react';
import { SendIcon, AlertCircle } from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Configuration Error</h2>
          </div>
          <p className="text-gray-600">
            OpenAI API key is missing. Please add your API key to the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
          </p>
          <pre className="bg-gray-100 p-4 rounded-lg mt-4 text-sm">
            VITE_OPENAI_API_KEY=your_api_key_here
          </pre>
        </div>
      </div>
    );
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'Sorry, I could not process that.'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
        
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              Thinking...
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;