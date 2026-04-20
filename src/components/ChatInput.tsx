import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-2 transition-all duration-300 focus-within:border-slate-300 shadow-sm">
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Type a message..."
        className="w-full bg-transparent border-none focus:ring-0 resize-none px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 min-h-[48px]"
        disabled={disabled}
      />

      <div className="flex items-center justify-between px-2 pb-2">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="p-2 text-slate-300 hover:text-slate-500 rounded-lg transition-all"
            title="Attach"
          >
            <Paperclip size={16} />
          </button>
          <button
            type="button"
            className="p-2 text-slate-300 hover:text-slate-500 rounded-lg transition-all"
            title="Search"
          >
            <Globe size={16} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "p-2 rounded-lg transition-all duration-300",
            message.trim() && !disabled
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "bg-slate-50 text-slate-200 cursor-not-allowed"
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};