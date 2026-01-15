import React, { useState } from 'react';
import { HomeView } from './components/HomeView';
import { ProcessingView } from './components/ProcessingView';
import { SummaryView } from './components/SummaryView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { ResultsView } from './components/ResultsView';
import { AppView, StudyMaterial } from './types';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [data, setData] = useState<StudyMaterial | null>(null);
  const [quizResult, setQuizResult] = useState<{score: number, total: number} | null>(null);

  const handleStudyDataGenerated = (generatedData: StudyMaterial) => {
    setData(generatedData);
    setView(AppView.SUMMARY);
  };

  const handleQuizFinish = (score: number, total: number) => {
    setQuizResult({ score, total });
    setView(AppView.RESULTS);
  };

  const handleNewDocument = () => {
    setData(null);
    setQuizResult(null);
    setView(AppView.HOME);
  };

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return <HomeView onSuccess={handleStudyDataGenerated} setAppView={setView} />;
      case AppView.PROCESSING:
        return <ProcessingView />;
      case AppView.SUMMARY:
        return data ? <SummaryView data={data} /> : null;
      case AppView.FLASHCARDS:
        return data ? <FlashcardsView data={data} /> : null;
      case AppView.QUIZ:
        return data ? <QuizView data={data} onFinish={handleQuizFinish} /> : null;
      case AppView.RESULTS:
        return quizResult ? (
          <ResultsView 
            score={quizResult.score} 
            total={quizResult.total} 
            onReset={handleNewDocument}
            onRetry={() => setView(AppView.QUIZ)} 
          />
        ) : null;
      default:
        return <HomeView onSuccess={handleStudyDataGenerated} setAppView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header (Only visible if not Home/Processing) */}
      {view !== AppView.HOME && view !== AppView.PROCESSING && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <ICONS.Sparkles className="text-blue-600" />
              <span>StudyGenius</span>
            </div>
            
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setView(AppView.SUMMARY)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === AppView.SUMMARY ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Zusammenfassung
              </button>
              <button 
                 onClick={() => setView(AppView.FLASHCARDS)}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === AppView.FLASHCARDS ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Karteikarten
              </button>
              <button 
                 onClick={() => setView(AppView.QUIZ)}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === AppView.QUIZ ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Quiz
              </button>
            </nav>

            <button 
              onClick={handleNewDocument}
              className="text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <ICONS.File className="w-4 h-4" />
              Neues Dokument
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} StudyGenius. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
