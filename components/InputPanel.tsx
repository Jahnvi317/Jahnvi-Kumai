
import React, { useState, useRef } from 'react';
import { InputType, UserInput } from '../types';

interface InputPanelProps {
  onProcess: (input: UserInput, highQuality: boolean) => void;
  disabled: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ onProcess, disabled }) => {
  const [activeType, setActiveType] = useState<InputType>(InputType.TEXT);
  const [textInput, setTextInput] = useState('');
  const [fileData, setFileData] = useState<{ name: string; content: string; mimeType: string } | null>(null);
  const [highQuality, setHighQuality] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (file.type.startsWith('image/')) {
        const base64 = result.split(',')[1];
        setFileData({ name: file.name, content: base64, mimeType: file.type });
        setActiveType(InputType.IMAGE);
      } else {
        setFileData({ name: file.name, content: result, mimeType: file.type });
        setActiveType(InputType.DOCUMENT);
      }
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    if (activeType === InputType.TEXT && textInput.trim()) {
      onProcess({ type: InputType.TEXT, content: textInput }, highQuality);
    } else if (fileData) {
      onProcess({ 
        type: activeType, 
        content: fileData.content, 
        fileName: fileData.name, 
        mimeType: fileData.mimeType 
      }, highQuality);
    }
  };

  const resetFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileData(null);
    setActiveType(InputType.TEXT);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModeSwitch = (type: InputType) => {
    if (disabled) return;
    if (type !== InputType.TEXT && !fileData) {
      fileInputRef.current?.click();
    } else {
      setActiveType(type);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass rounded-[2rem] p-2 shadow-2xl border border-white/10 overflow-hidden bg-slate-900/40">
        {/* Main Input Area */}
        <div className="relative group">
          {activeType === InputType.TEXT ? (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="What topic should I visualize for you today? Describe a scene or subject..."
              className="w-full h-56 bg-transparent p-8 text-xl text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none transition-all leading-relaxed"
              disabled={disabled}
            />
          ) : (
            <div 
              className="w-full h-56 flex flex-col items-center justify-center p-8 bg-white/5 rounded-3xl m-0 border-2 border-dashed border-white/5 transition-all hover:bg-white/10 cursor-pointer"
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center text-indigo-400 text-3xl shadow-inner border border-indigo-500/20">
                  <i className={`fas ${activeType === InputType.IMAGE ? 'fa-image' : 'fa-file-lines'}`}></i>
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-white max-w-[250px] truncate">{fileData?.name}</p>
                  <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest text-[10px] font-black">Asset Staged</p>
                  <button 
                    onClick={resetFile} 
                    className="text-xs text-red-400/80 hover:text-red-400 mt-3 flex items-center gap-1.5 transition-colors font-bold uppercase tracking-tighter"
                  >
                    <i className="fas fa-trash-can text-[10px]"></i> Discard Asset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode Selector Pill inside the box */}
          <div className="absolute top-6 right-6 flex items-center gap-1 bg-slate-950/90 backdrop-blur-xl p-1 rounded-full border border-white/10 z-20 shadow-xl">
            {[
              { id: InputType.TEXT, icon: 'fa-font', label: 'Text' },
              { id: InputType.IMAGE, icon: 'fa-image', label: 'Image' },
              { id: InputType.DOCUMENT, icon: 'fa-file-lines', label: 'Doc' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => handleModeSwitch(type.id as InputType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeType === type.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={type.label}
              >
                <i className={`fas ${type.icon}`}></i>
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept="image/*,.txt,.pdf,.doc,.docx"
        />

        {/* Integrated Bottom Toolbar */}
        <div className="bg-slate-950/30 p-5 px-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5">
          <div className="flex items-center gap-8 w-full sm:w-auto justify-center sm:justify-start">
            <button 
              onClick={() => !disabled && fileInputRef.current?.click()}
              className="flex items-center gap-2.5 text-slate-400 hover:text-indigo-400 transition-all text-xs font-bold uppercase tracking-wider group"
              disabled={disabled}
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 transition-all">
                <i className="fas fa-paperclip"></i>
              </div>
              <span>Upload Content</span>
            </button>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={highQuality} 
                  onChange={(e) => setHighQuality(e.target.checked)}
                  className="sr-only peer"
                  disabled={disabled}
                />
                <div className="w-10 h-5 bg-white/5 rounded-full peer-checked:bg-indigo-600 transition-all border border-white/10"></div>
                <div className="absolute left-1 top-1 w-3 h-3 bg-white/80 rounded-full peer-checked:translate-x-5 transition-transform"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-300 transition-colors uppercase tracking-[0.2em]">
                Ultra HD
              </span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={disabled || (activeType === InputType.TEXT ? !textInput.trim() : !fileData)}
            className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
              disabled || (activeType === InputType.TEXT ? !textInput.trim() : !fileData)
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {disabled ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <i className="fas fa-bolt-lightning"></i>
            )}
            <span>{disabled ? 'Synthesizing' : 'Manifest Vision'}</span>
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="h-[1px] w-12 bg-white/10"></div>
        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.4em] text-center">
          Intelligence provided by Gemini 2.5 & 3 Series
        </p>
      </div>
    </div>
  );
};

export default InputPanel;
