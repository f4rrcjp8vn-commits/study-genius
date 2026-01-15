import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StudyMaterial } from '../types';
import { ICONS } from '../constants';

// We added html2pdf via CDN in index.html, so we declare it here to avoid TS errors
declare var html2pdf: any;

interface SummaryViewProps {
  data: StudyMaterial;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<number>(0);

  const handleDownloadPDF = async () => {
    if (!contentRef.current || typeof html2pdf === 'undefined') {
      alert("PDF Funktion ist nicht verfügbar.");
      return;
    }

    setIsDownloading(true);
    const element = contentRef.current;
    
    // Configuration for html2pdf
    const opt = {
      margin:       [10, 10], // top, left, bottom, right in mm
      filename:     'Zusammenfassung-StudyGenius.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      alert("Fehler beim Erstellen des PDFs.");
    } finally {
      setIsDownloading(false);
    }
  };

  const scrollToTopic = (index: number) => {
    setActiveTopic(index);
    const el = document.getElementById(`topic-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ICONS.File className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Zusammenfassung</h2>
            <p className="text-slate-500 text-sm">Alle Inhalte kompakt strukturiert</p>
          </div>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <ICONS.Refresh className="w-4 h-4 animate-spin" />
          ) : (
            <ICONS.Upload className="w-4 h-4 rotate-180" /> 
          )}
          {isDownloading ? 'Erstelle PDF...' : 'Als PDF herunterladen'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation (Desktop) - Hidden on PDF */}
        <div className="hidden lg:block lg:col-span-1 no-print">
          <div className="sticky top-24 space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Inhaltsverzeichnis</h3>
            {data.summary.map((topic, index) => (
              <button
                key={index}
                onClick={() => scrollToTopic(index)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTopic === index 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {index + 1}. {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Printable */}
        <div className="lg:col-span-3 space-y-10" ref={contentRef}>
          {/* Cover Page for PDF */}
          <div className="hidden print-only mb-10 text-center border-b-2 border-slate-900 pb-10">
            <h1 className="text-4xl font-bold mb-2">Lernzusammenfassung</h1>
            <p className="text-slate-500">Erstellt mit StudyGenius</p>
          </div>

          {data.summary.map((topic, index) => (
            <div key={index} id={`topic-${index}`} className="scroll-mt-24 break-inside-avoid">
              <div className="flex items-baseline gap-3 mb-4 border-b border-slate-100 pb-2">
                 <span className="text-3xl font-bold text-blue-100">{index + 1}</span>
                 <h3 className="text-2xl font-bold text-slate-800">{topic.title}</h3>
              </div>
              
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-justify">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h4 className="text-xl font-bold text-slate-900 mt-6 mb-3" {...props} />,
                    h2: ({node, ...props}) => <h5 className="text-lg font-bold text-slate-800 mt-5 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h6 className="text-base font-bold text-slate-800 mt-4 mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-4" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 bg-yellow-50 px-0.5 rounded" {...props} />,
                  }}
                >
                  {topic.content}
                </ReactMarkdown>
              </div>

              {topic.learningQuestions.length > 0 && (
                <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                  <div className="flex items-center gap-2 mb-4 text-blue-800 font-semibold uppercase tracking-wide text-xs">
                    <ICONS.Brain className="w-4 h-4" />
                    <span>Kontrollfragen</span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.learningQuestions.map((q, qIndex) => (
                      <li key={qIndex} className="flex items-start gap-3 text-slate-700 text-sm bg-white p-3 rounded-lg border border-slate-100">
                        <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                          ?
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

           {/* Footer for PDF */}
           <div className="hidden print-only mt-10 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
            Generiert von StudyGenius AI
          </div>
        </div>
      </div>
    </div>
  );
};