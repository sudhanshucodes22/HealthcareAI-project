import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Heart, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export default function MentalHealth() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: '💚 Hello friend! I\'m here to listen and support you. How are you feeling today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const response = await api.get('/mental/history');
      if (response.data.length > 0) {
        const historyMessages = response.data.map((chat: any) => ([
          {
            role: 'user',
            content: chat.message,
            timestamp: new Date(chat.createdAt)
          },
          {
            role: 'bot',
            content: chat.response,
            timestamp: new Date(chat.createdAt)
          }
        ])).flat();
        setMessages(prev => [...prev, ...historyMessages]);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!user) {
      const authMessage: Message = {
        role: 'bot',
        content: 'Please login or create an account to use the AI Mental Health Support. This helps us maintain your journey history and provide consistent support.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, { role: 'user', content: input, timestamp: new Date() }, authMessage]);
      setInput('');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    setError('');

    try {
      const response = await api.post('/mental/chat', { message: currentInput });
      const botMessage: Message = {
        role: 'bot',
        content: response.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setError('I encountered an error. Please try again.');
      const errorMessage: Message = {
        role: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden pt-20 pb-8 px-4">
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 animate-float animate-pulse-glow">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-3">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-text-shimmer">
              Mental Health Support
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-light">A safe space for emotional support and positive guidance</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center space-x-2 glass-effect animate-bounce">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="glass-effect border-l-4 border-blue-400 p-4 rounded-lg mb-6 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-spin-slow" />
          <div className="text-sm text-blue-100">
            This chatbot provides emotional support and encouragement. For professional mental health support,
            please reach out to a licensed therapist or counselor. In crisis, call 988 or text HOME to 741741.
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 animate-slide-in ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'bot'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-teal-500 to-cyan-600'
                    }`}
                >
                  {message.role === 'bot' ? (
                    <Heart className="w-5 h-5 text-white" fill="white" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 p-4 rounded-2xl ${message.role === 'bot'
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                    : 'bg-gradient-to-br from-teal-100 to-cyan-100'
                    }`}
                >
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3 animate-slide-in">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Share how you're feeling..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🌈</div>
            <p className="text-sm font-semibold text-gray-700">Self-Care Matters</p>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">💪</div>
            <p className="text-sm font-semibold text-gray-700">You Are Strong</p>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🤗</div>
            <p className="text-sm font-semibold text-gray-700">You're Not Alone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
