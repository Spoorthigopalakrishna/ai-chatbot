import React from 'react';
import { Message } from '../types';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
  onFeedback?: (messageId: string, isHelpful: boolean) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onFeedback }) => {
  const isBot = message.role === 'assistant';
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "group flex w-full gap-4 px-6 py-10 transition-all",
        isBot ? "bg-transparent" : "bg-transparent"
      )}
    >
      <div className="flex-shrink-0">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
          isBot 
            ? "bg-slate-900 text-white shadow-sm" 
            : "bg-slate-100 text-slate-500"
        )}>
          {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>
      </div>

      <div className="flex-1 space-y-4 max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              {isBot ? "Assistant" : "You"}
            </span>
            <span className="text-[10px] font-medium text-slate-300">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {isBot && (
            <button
              onClick={copyToClipboard}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-slate-500 transition-all uppercase tracking-widest"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>

        <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-headings:text-slate-800 prose-code:text-slate-500">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative my-6 group/code">
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !m-0 !bg-[#1e293b] border border-slate-800 shadow-sm"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={cn("bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium before:content-none after:content-none", className)} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {isBot && (
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onFeedback?.(message.id, true)}
                className="p-1 text-slate-300 hover:text-emerald-500 transition-colors"
                title="Helpful"
              >
                <ThumbsUp size={12} />
              </button>
              <button
                onClick={() => onFeedback?.(message.id, false)}
                className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                title="Not helpful"
              >
                <ThumbsDown size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};