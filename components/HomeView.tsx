import React, { useState, useRef } from 'react';
import { ICONS, ALLOWED_TYPES } from '../constants';
import { generateStudyMaterial } from '../services/geminiService';
import { StudyMaterial, AppView } from '../types';

interface HomeViewProps {
  onSuccess: (data: StudyMaterial) => void;
  setAppView: (view: AppView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSuccess, setAppView }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState('');
  const [focus, setFocus] = useState('');
  const [omit, setOmit] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => ALLOWED_TYPES.includes(f.type) || f.name.endsWith('.docx') || f.name.endsWith('.pdf'));
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0 && !rawText.trim()) {
      alert("Bitte lade Dateien hoch oder gib einen Text ein.");
      return;
    }

    setAppView(AppView.PROCESSING);
    try {
      const data = await generateStudyMaterial(files, rawText, focus, omit);
      onSuccess(data);
    } catch (error) {
      console.error(error);
      alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      setAppView(AppView.HOME);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dein KI Lernassistent</h1>
        <p className="text-lg text-slate-600">Lade deine Skripte hoch und erhalte sofort Zusammenfassungen, Flashcards und Quizze.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        {/* File Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <ICONS.Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Dateien hier ablegen oder klicken</h3>
          <p className="text-sm text-slate-500 mt-1">PDF, Word, Text, Bilder (Kein Limit)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <ICONS.File className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                  <span className="text-xs text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-slate-400 hover:text-red-500">
                  <ICONS.Close className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Oder Text direkt eingeben</label>
          <textarea 
            className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32"
            placeholder="Kopiere hier deine Notizen rein..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Lernfokus (Optional)</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="z.B. Nur Kapitel 3, Definitionen..."
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Weglassen (Optional)</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="z.B. Einleitung, Literaturverzeichnis..."
              value={omit}
              onChange={(e) => setOmit(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
        >
          <ICONS.Sparkles className="w-6 h-6" />
          Lernmaterial erstellen
        </button>
      </div>
    </div>
  );
};
