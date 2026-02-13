
import React from 'react';

interface LoaderProps {
  stage: string;
}

const Loader: React.FC<LoaderProps> = ({ stage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-brain text-indigo-400 text-xl animate-bounce"></i>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white tracking-tight">{stage}</h3>
        <p className="text-slate-400 text-sm max-w-[200px]">
          Gemini is synthesizing context and rendering your visualization...
        </p>
      </div>
    </div>
  );
};

export default Loader;
