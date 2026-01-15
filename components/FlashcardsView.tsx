import React, { useState } from 'react';
import { StudyMaterial } from '../types';
import { ICONS } from '../constants';

interface FlashcardsViewProps {
  data: StudyMaterial;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.flashcards.length);
    }, 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + data.flashcards.length) % data.flashcards.length);
    }, 200);
  };

  const card = data.flashcards[currentIndex];

  if (!card) return <div className="p-8 text-center">Keine Flashcards verfügbar.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
       <div className="flex items-center gap-3 mb-8 w-full border-b border-slate-200 pb-4">
        <ICONS.Book className="w-8 h-8 text-emerald-600" />
        <h2 className="text-3xl font-bold text-slate-900">Karteikarten</h2>
        <span className="ml-auto text-slate-500 font-medium">{currentIndex + 1} / {data.flashcards.length}</span>
      </div>

      <div 
        className="group perspective-1000 w-full h-80 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center p-8">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Frage / Begriff</span>
            <p className="text-2xl font-medium text-slate-800">{card.front}</p>
            <p className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-1">
              <ICONS.Refresh className="w-4 h-4" /> Klicken zum Umdrehen
            </p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-emerald-50 rounded-2xl border-2 border-emerald-100 rotate-y-180 flex flex-col items-center justify-center p-8">
             <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">Antwort / Definition</span>
            <p className="text-xl text-emerald-900">{card.back}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-10">
        <button 
          onClick={prevCard} 
          className="p-4 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
        >
          <ICONS.Next className="w-6 h-6 rotate-180 text-slate-600" />
        </button>
        <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / data.flashcards.length) * 100}%` }}
          />
        </div>
        <button 
          onClick={nextCard} 
          className="p-4 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
        >
          <ICONS.Next className="w-6 h-6 text-slate-600" />
        </button>
      </div>
    </div>
  );
};
