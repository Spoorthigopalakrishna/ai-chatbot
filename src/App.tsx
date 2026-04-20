import { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { 
  Bot, 
  Trash2, 
  Github, 
  Settings, 
  HelpCircle, 
  MessageSquarePlus, 
  Search, 
  LayoutDashboard, 
  History,
  ShieldCheck,
  Zap,
  MoreVertical,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useChat } from './hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

function App() {
  const { messages, isLoading, sendMessage, submitFeedback, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('chats');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const showWelcome = messages.length <= 1 && !isLoading;

  return (
    <div className="flex h-screen w-full bg-slate-50/30 text-slate-700 overflow-hidden font-sans">
      {/* Sidebar - Subtle Zinc Design */}
      <aside className="w-80 bg-white flex flex-col hidden lg:flex border-r border-slate-100">
        <div className="p-6 flex flex-col h-full">
          {/* Workspace Switcher */}
          <div className="flex items-center justify-between mb-8 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 transition-transform">
                <Zap size={20} />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Enterprise Console</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Internal Instance</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-300" />
          </div>

          <button 
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 transition-all mb-8 shadow-sm active:scale-95"
          >
            <MessageSquarePlus size={16} />
            New Conversation
          </button>

          <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">Workspace</p>
              <div className="space-y-0.5">
                {[
                  { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
                  { id: 'chats', icon: History, label: 'Recent Chats' },
                  { id: 'security', icon: ShieldCheck, label: 'Audit Logs' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                      activeTab === item.id 
                        ? "bg-slate-100 text-slate-900 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">Resources</p>
              <div className="space-y-0.5">
                {[
                  { icon: HelpCircle, label: 'Help Center' },
                  { icon: Github, label: 'Source Docs' },
                  { icon: Settings, label: 'Preferences' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-sm font-medium group"
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-6 border-t border-slate-50">
            <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-all cursor-pointer group">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                SD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">S. Gopalakrishna</p>
                <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-widest">Admin</p>
              </div>
              <LogOut size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        {/* Subtle Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Bot size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-slate-800 tracking-tight">AI Assistant v2.0</h2>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connected</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-300 hover:text-slate-500 transition-all">
              <Search size={18} />
            </button>
            <button className="p-2 text-slate-300 hover:text-slate-500 transition-all">
              <MoreVertical size={18} />
            </button>
            <div className="h-4 w-[1px] bg-slate-100" />
            <button 
              onClick={clearChat}
              className="p-2 text-slate-300 hover:text-rose-400 transition-all"
              title="Clear Session"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#fcfcfc]">
          <div className="max-w-3xl mx-auto py-12">
            {showWelcome && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 mb-16 text-center"
              >
                <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm border border-slate-50 mb-6">
                  <Bot size={32} className="text-slate-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
                  How can I help you today?
                </h1>
                <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto leading-relaxed mb-10">
                  Ask a question or select a topic below to explore the assistant's capabilities.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {[
                    'Technical Support',
                    'Billing Information',
                    'Security Features',
                    'Account Management'
                  ].map((topic) => (
                    <button 
                      key={topic}
                      onClick={() => sendMessage(topic)}
                      className="p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm active:scale-[0.98]"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  onFeedback={message.role === 'assistant' ? submitFeedback : undefined}
                />
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 px-6 py-10"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                  <Bot size={16} className="animate-pulse" />
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <div className="w-1 h-1 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 bg-slate-200 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Subtle Input Container */}
        <div className="px-6 pb-6 bg-[#fcfcfc]">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}


export default App;