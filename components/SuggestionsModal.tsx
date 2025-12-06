import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, BookHeart, MessageCircle, Lightbulb, ShieldCheck } from 'lucide-react';
import { Suggestion, SuggestionCategory } from '../types';
import { generateSuggestions } from '../services/geminiService';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ isOpen, onClose, isAdmin }) => {
  const [activeTab, setActiveTab] = useState<SuggestionCategory>('scripture');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initial load when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSuggestions('scripture');
      setActiveTab('scripture');
    }
  }, [isOpen]);

  const loadSuggestions = async (category: SuggestionCategory) => {
    setLoading(true);
    // Clear current list to show loading state better
    setSuggestions([]); 
    const newSuggestions = await generateSuggestions(category);
    setSuggestions(newSuggestions);
    setLoading(false);
  };

  const handleTabChange = (category: SuggestionCategory) => {
    if (category === activeTab) return;
    setActiveTab(category);
    loadSuggestions(category);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const categories: { id: SuggestionCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'scripture', label: 'Ánimo', icon: <BookHeart size={18} />, color: 'text-pink-600 bg-pink-50 border-pink-200' },
    { id: 'presentation', label: 'Ideas', icon: <MessageCircle size={18} />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'practical', label: 'Tips', icon: <Lightbulb size={18} />, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { id: 'safety', label: 'Cuidado', icon: <ShieldCheck size={18} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-400" />
            Sugerencias
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-wide transition-colors relative
                ${activeTab === cat.id ? 'text-slate-900 bg-gray-50' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
              `}
            >
              <div className={activeTab === cat.id ? 'text-slate-900' : 'opacity-70'}>
                {cat.icon}
              </div>
              <span>{cat.label}</span>
              {activeTab === cat.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-gray-50/50">
          
          {loading ? (
             <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-60">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
               <p className="text-xs font-medium text-gray-500 animate-pulse">Consultando jw.org...</p>
             </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl border border-b-2 shadow-sm relative group bg-white animate-fade-in transition-all hover:shadow-md
                  ${categories.find(c => c.id === item.category)?.color.replace('text-', 'border-').split(' ')[2]}
                `}
              >
                <div className="pr-6">
                  <p className="font-medium text-gray-800 text-sm leading-relaxed">
                    {item.text}
                  </p>
                  {item.reference && (
                    <div className="flex items-center gap-1 mt-2">
                       <span className={`h-1 w-1 rounded-full ${categories.find(c => c.id === item.category)?.color.split(' ')[0].replace('text', 'bg')}`}></span>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                         {item.reference}
                       </p>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleCopy(`${item.text} ${item.reference ? `(${item.reference})` : ''}`, item.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-slate-900 transition"
                >
                  {copiedId === item.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 px-4">
               <p className="text-gray-400 text-sm">Selecciona una categoría para ver sugerencias.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-2 border-t bg-white text-center shrink-0">
            <p className="text-[10px] text-gray-400">
                Información basada en jw.org y TNM.
            </p>
        </div>

      </div>
    </div>
  );
};

export default SuggestionsModal;