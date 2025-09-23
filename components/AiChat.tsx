import React, { useState, useRef, useEffect } from 'react';
import type { AiResponseMessage } from '../types';
import { Send, Bot, User, Loader, X } from 'lucide-react';

interface AiChatProps {
  history: AiResponseMessage[];
  isLoading: boolean;
  onQuery: (prompt: string) => void;
  onClose: () => void;
}

const AiChat: React.FC<AiChatProps> = ({ history, isLoading, onQuery, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onQuery(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 border-t border-gray-700">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-300 flex items-center">
            <Bot className="mr-2 text-cyan-400" size={20} />
            Planning AI Chat
        </h2>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors">
            <X size={20} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {history.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Bot size={18} className="text-cyan-400" />
                </div>
            )}
            <div
              className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
             {msg.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <User size={18} className="text-gray-300" />
                </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Bot size={18} className="text-cyan-400" />
            </div>
            <div className="bg-gray-700 rounded-lg px-4 py-2 rounded-bl-none">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Loader className="animate-spin" size={16} />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Show capitals of Europe"
            className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiChat;