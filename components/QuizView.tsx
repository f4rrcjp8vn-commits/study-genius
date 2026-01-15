import React, { useState, useEffect } from 'react';
import { StudyMaterial, QuizState, AppView } from '../types';
import { ICONS } from '../constants';

interface QuizViewProps {
  data: StudyMaterial;
  onFinish: (score: number, total: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ data, onFinish }) => {
  const [state, setState] = useState<QuizState>({
    currentChapterIndex: 0,
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    answers: []
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Calculate total questions
    const total = data.quiz.reduce((acc, chapter) => acc + chapter.questions.length, 0);
    setState(prev => ({ ...prev, totalQuestions: total }));
  }, [data]);

  const currentChapter = data.quiz[state.currentChapterIndex];
  const currentQuestion = currentChapter?.questions[state.currentQuestionIndex];

  if (!currentQuestion) return <div className="p-8">Fehler: Keine Quizdaten vorhanden.</div>;

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    
    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }
    
    setState(prev => ({
      ...prev,
      answers: [...prev.answers, { 
        questionId: `${state.currentChapterIndex}-${state.currentQuestionIndex}`, 
        isCorrect 
      }]
    }));
  };

  const handleFinishEarly = () => {
    // Finish with the number of questions answered so far as the total
    const answeredCount = state.answers.length;
    onFinish(state.score, answeredCount);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setShowHint(false);

    const isLastQuestionInChapter = state.currentQuestionIndex === currentChapter.questions.length - 1;
    const isLastChapter = state.currentChapterIndex === data.quiz.length - 1;

    if (isLastQuestionInChapter) {
      if (isLastChapter) {
        onFinish(state.score, state.totalQuestions);
      } else {
        setState(prev => ({
          ...prev,
          currentChapterIndex: prev.currentChapterIndex + 1,
          currentQuestionIndex: 0
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Kapitel {state.currentChapterIndex + 1} von {data.quiz.length}
            </span>
            <span className="text-slate-500 text-sm font-medium truncate max-w-[150px] sm:max-w-[200px]">
                {currentChapter.topicName}
            </span>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button 
                onClick={handleFinishEarly}
                className="text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors px-2 py-1"
                title="Quiz abbrechen und Ergebnis anzeigen"
            >
                Beenden & Auswerten
            </button>
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-500 uppercase font-bold">Fortschritt</p>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                            className="bg-indigo-600 h-full transition-all duration-500"
                            style={{ width: `${(state.answers.length / state.totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-lg">
                    <span className="text-indigo-600 font-bold">{state.score}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-8 pb-4">
            <h3 className="text-xl font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.question}
            </h3>
        </div>

        {/* Options */}
        <div className="p-8 pt-2 grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, idx) => {
                let btnClass = "p-4 text-left rounded-xl border-2 transition-all font-medium ";
                if (selectedOption === null) {
                    btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
                } else {
                    if (idx === currentQuestion.correctAnswerIndex) {
                        btnClass += "border-green-500 bg-green-50 text-green-900";
                    } else if (idx === selectedOption) {
                        btnClass += "border-red-500 bg-red-50 text-red-900";
                    } else {
                        btnClass += "border-slate-100 text-slate-400 opacity-50";
                    }
                }

                return (
                    <button 
                        key={idx}
                        disabled={selectedOption !== null}
                        onClick={() => handleOptionClick(idx)}
                        className={btnClass}
                    >
                        <span className="inline-block w-6 font-bold opacity-60 mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {option}
                    </button>
                );
            })}
        </div>

        {/* Tools Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
            <button 
                onClick={() => setShowHint(!showHint)}
                disabled={selectedOption !== null}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showHint ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-200'}`}
            >
                <ICONS.Hint className="w-4 h-4" />
                {showHint ? 'Hinweis verbergen' : 'Hinweis anzeigen'}
            </button>

            {selectedOption !== null && (
                <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-transform active:scale-95"
                >
                    Weiter
                    <ICONS.Next className="w-4 h-4" />
                </button>
            )}
        </div>

        {/* Hint Area */}
        {showHint && !showExplanation && (
            <div className="bg-amber-50 p-4 border-t border-amber-100 text-amber-900 text-sm animate-in slide-in-from-top-2">
                <strong>💡 Hinweis:</strong> {currentQuestion.hint}
            </div>
        )}

        {/* Explanation Area */}
        {showExplanation && (
            <div className={`p-6 border-t ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} animate-in slide-in-from-bottom-2`}>
                <div className="flex items-start gap-3">
                    {selectedOption === currentQuestion.correctAnswerIndex 
                        ? <ICONS.Check className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                        : <ICONS.Close className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                    }
                    <div>
                        <h4 className={`font-bold mb-1 ${selectedOption === currentQuestion.correctAnswerIndex ? 'text-green-800' : 'text-red-800'}`}>
                            {selectedOption === currentQuestion.correctAnswerIndex ? 'Richtig!' : 'Leider falsch.'}
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                            {currentQuestion.explanation}
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};