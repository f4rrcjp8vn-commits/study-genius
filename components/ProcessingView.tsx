import React from 'react';
import { ICONS } from '../constants';

export const ProcessingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-25"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg">
          <ICONS.Brain className="w-16 h-16 text-blue-600 animate-pulse" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-slate-800">Analysiere Inhalte...</h2>
      <p className="mt-2 text-slate-500 max-w-md">
        Unsere KI liest deine Dokumente, strukturiert das Wissen und bereitet dein Quiz vor. Das kann einen Moment dauern.
      </p>
    </div>
  );
};
