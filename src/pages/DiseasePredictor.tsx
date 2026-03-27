import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export default function DiseasePredictor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! I\'m your AI Health Assistant. I can help predict possible conditions based on your symptoms. Please describe your symptoms in detail.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { user } = useAuth();

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!user) {
      const authMessage: Message = {
        role: 'bot',
        content: 'Please login or create an account to use the AI Disease Predictor. This helps us maintain your health history and provide better insights.',
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
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/disease/predict', { symptoms: input });
      const botMessage: Message = {
        role: 'bot',
        content: response.data.prediction,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'bot',
        content: "I'm sorry, I encountered an error while analyzing your symptoms. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-8 px-4">
      {/* Hospital Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hospital-bg.png)',
          filter: 'brightness(0.4)',
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-blue-950/95"></div>

      {/* Animated Blobs */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-3">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-text-shimmer">
              AI Disease Predictor
            </span>
          </h1>
          <p className="text-xl text-slate-400 font-light">Describe your symptoms and get instant health insights</p>
        </div>

        <div className="relative z-10 mb-6 glass-effect p-4 rounded-lg border border-blue-500/30 flex items-start space-x-3 bg-blue-500/5">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="text-sm text-blue-100/80">
            <strong className="text-blue-400">Medical Disclaimer:</strong> This tool provides informational guidance only and is NOT a medical diagnosis.
            Always consult a qualified healthcare professional for proper medical advice.
          </div>
        </div>

        <div className="relative z-10 glass-effect rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-white/10 bg-slate-900/40">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 animate-slide-in ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'bot'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                    : 'bg-gradient-to-br from-teal-500 to-emerald-600'
                    }`}
                >
                  {message.role === 'bot' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 p-5 rounded-2xl backdrop-blur-md border ${message.role === 'bot'
                    ? 'bg-white/5 border-white/10 text-white shadow-xl'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-50'
                    }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p className={`text-[10px] mt-3 font-medium uppercase tracking-wider ${message.role === 'bot' ? 'text-blue-400' : 'text-teal-400'
                    }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3 animate-slide-in">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center animate-pulse-glow">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="p-4 rounded-2xl glass-effect border border-blue-500/30">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gradient-to-r from-slate-900/50 to-indigo-900/50 border-t border-white/10">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your symptoms..."
                className="flex-1 px-4 py-3 rounded-xl glass-effect border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 bg-white/5"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></span>
                <Send className="w-5 h-5 relative z-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
