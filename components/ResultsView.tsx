import React from 'react';
import { ICONS } from '../constants';

interface ResultsViewProps {
  score: number;
  total: number;
  onReset: () => void;
  onRetry: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ score, total, onReset, onRetry }) => {
  // Prevent division by zero if user exits immediately
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  let message = "";
  let colorClass = "";

  if (percentage >= 90) {
    message = "Fantastisch! Du bist ein wahrer Experte.";
    colorClass = "text-emerald-600";
  } else if (percentage >= 70) {
    message = "Sehr gut! Du hast den Stoff verstanden.";
    colorClass = "text-blue-600";
  } else if (percentage >= 50) {
    message = "Gut gemacht. Ein bisschen Wiederholung schadet nicht.";
    colorClass = "text-amber-600";
  } else {
    message = "Nicht aufgeben! Schau dir die Zusammenfassung nochmal an.";
    colorClass = "text-red-600";
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center animate-in zoom-in duration-300">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 space-y-8">
        <div className="inline-flex p-4 rounded-full bg-yellow-50 mb-4">
            <ICONS.Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        
        <h2 className="text-4xl font-bold text-slate-900">Quiz Abgeschlossen</h2>
        
        <div className="py-4">
            <div className={`text-6xl font-black mb-2 ${colorClass}`}>
                {percentage}%
            </div>
            <p className="text-slate-400 font-medium text-lg">
                {score} von {total} Fragen richtig
            </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl">
            <p className="text-xl font-medium text-slate-800 italic">"{message}"</p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
             <button 
                onClick={onRetry}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
                Quiz wiederholen
            </button>
            <button 
                onClick={onReset}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
                <ICONS.Home className="w-5 h-5" />
                Neues Dokument
            </button>
        </div>
      </div>
    </div>
  );
};