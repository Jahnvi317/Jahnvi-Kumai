
import React from 'react';
import { GeneratedResult } from '../types';

interface ResultDisplayProps {
  result: GeneratedResult;
  onBack: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Image Card */}
        <div className="space-y-4">
          <div className="relative group overflow-hidden rounded-2xl glass p-2">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <p className="text-white text-sm font-medium italic">"Artificially imagined from your curiosity"</p>
            </div>
            <img 
              src={result.imageUrl} 
              alt={result.title} 
              className="w-full aspect-video object-cover rounded-xl shadow-2xl animate-float"
            />
            <div className="absolute top-4 right-4 z-20">
               <button 
                onClick={() => window.open(result.imageUrl, '_blank')}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
               >
                 <i className="fas fa-expand text-white"></i>
               </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = result.imageUrl;
                link.download = `${result.title.replace(/\s+/g, '_')}_vision.png`;
                link.click();
              }}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-download"></i> Save Image
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <i className="fas fa-share-nodes"></i> Share
            </button>
          </div>
        </div>

        {/* Right: Info Card */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-white/5 bg-slate-900/40">
            <div>
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Neural Summary</span>
              <h2 className="text-4xl font-black mt-2 text-white leading-tight">{result.title}</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed text-lg italic font-medium opacity-90">
                "{result.description}"
              </p>
              
              <div className="pt-6 border-t border-white/5">
                <h3 className="text-xs font-black text-slate-500 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <i className="fas fa-brain text-indigo-500"></i>
                  Knowledge Extract
                </h3>
                <ul className="space-y-6">
                  {result.facts.map((fact, idx) => (
                    <li key={idx} className="flex gap-4 group">
                      <div className="mt-1 w-6 h-6 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:scale-110 transition-all">
                        <span className="text-[10px] font-black text-indigo-400 group-hover:text-white">{idx + 1}</span>
                      </div>
                      <p className="text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed text-sm">
                        {fact}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button 
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                onClick={onBack}
              >
                <i className="fas fa-plus"></i> New Visualization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
