
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { GeminiService } from './geminiService';
import { UserInput, GeneratedResult, ProcessingState } from './types';

type ViewMode = 'input' | 'output';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('input');
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    stage: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async (input: UserInput, highQuality: boolean) => {
    if (highQuality) {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }
    }

    setProcessing({ isProcessing: true, stage: 'Analyzing your input...' });
    setError(null);
    setResult(null);

    const service = new GeminiService();
    
    try {
      setProcessing(p => ({ ...p, stage: 'Thinking and conceptualizing...' }));
      const res = await service.analyzeAndGenerate(input, highQuality);
      setProcessing(p => ({ ...p, stage: 'Manifesting visual data...' }));
      
      setTimeout(() => {
        setResult(res);
        setProcessing({ isProcessing: false, stage: '' });
        setView('output');
      }, 800);

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        if (typeof window.aistudio !== 'undefined') {
          await window.aistudio.openSelectKey();
        }
      }
      setError(err.message || 'An unexpected error occurred while visualizing your topic.');
      setProcessing({ isProcessing: false, stage: '' });
    }
  }, []);

  const goToInput = () => {
    setView('input');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24">
      <Header />
      
      <main className="space-y-8">
        {/* Navigation Tabs (only if not processing) */}
        {!processing.isProcessing && (
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={() => setView('input')}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                view === 'input' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 hover:text-slate-300 bg-white/5'
              }`}
            >
              Input
            </button>
            <button 
              onClick={() => result && setView('output')}
              disabled={!result}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                view === 'output' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 hover:text-slate-300 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              Output
            </button>
          </div>
        )}

        {view === 'input' && !processing.isProcessing && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <section className="text-center space-y-4 pt-4 mb-12">
              <h2 className="text-5xl font-extrabold text-white tracking-tight">
                Visualize Any <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Concept</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Upload text, documents, or images to manifest a cinematic vision and detailed knowledge profile.
              </p>
            </section>

            <InputPanel 
              onProcess={handleProcess} 
              disabled={processing.isProcessing} 
            />
          </div>
        )}

        {error && view === 'input' && (
          <div className="max-w-3xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 mt-6">
            <i className="fas fa-triangle-exclamation"></i>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {processing.isProcessing && (
          <div className="animate-in zoom-in-95 fade-in duration-300">
            <Loader stage={processing.stage} />
          </div>
        )}

        {view === 'output' && result && !processing.isProcessing && (
          <div className="animate-in slide-in-from-right-10 fade-in duration-500">
            <div className="max-w-5xl mx-auto mb-6">
              <button 
                onClick={goToInput}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest group"
              >
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                <span>Back to Input</span>
              </button>
            </div>
            <ResultDisplay result={result} onBack={goToInput} />
          </div>
        )}
      </main>

      <footer className="mt-32 text-center text-slate-600 text-xs border-t border-white/5 pt-8">
        <p>&copy; 2024 VisionaryAI Project. Powered by Gemini 3 Flash & 2.5 Pro Models.</p>
        <p className="mt-2">Billing and API Key management is required for Ultra-Realistic generations.</p>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-600 hover:underline mt-1 block">Learn about billing</a>
      </footer>
    </div>
  );
};

export default App;
