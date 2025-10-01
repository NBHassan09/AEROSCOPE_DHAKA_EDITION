import React, { useState, useRef, useEffect } from 'react';
import type { AiResponseMessage } from '../types';
import { Send, Bot, User, Loader, X, Wand2 } from 'lucide-react';

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

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      onQuery(suggestion);
      setPrompt('');
    }
  };

  const suggestions = [
      "Summarize the area",
      "Suggest a location for a new hospital",
      "What are the planning challenges here?",
  ];

  return (
    <div className="flex flex-col h-full bg-white border-t border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Bot className="mr-2 text-emerald-500" size={20} />
            Planning AI Chat
        </h2>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {history.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Bot size={18} className="text-emerald-500" />
                </div>
            )}
            <div
              className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
             {msg.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={18} className="text-gray-700" />
                </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Bot size={18} className="text-emerald-500" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 rounded-bl-none">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Loader className="animate-spin" size={16} />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
                <Wand2 size={16} className="text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-600">Suggestions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
                <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                disabled={isLoading}
                className="px-3 py-1 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                {s}
                </button>
            ))}
            </div>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Suggest a good spot for a new park"
            className="w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChat;