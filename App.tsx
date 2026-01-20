import React, { useState } from 'react';
import { ProcessingState, AppStatus, MeetingAnalysis } from './types';
import { analyzeMeeting } from './services/geminiService';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { LoaderIcon, AlertCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ProcessingState>({
    status: AppStatus.IDLE,
  });
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setState({ status: AppStatus.ANALYZING, message: "Initializing secure upload..." });
    
    try {
      const result = await analyzeMeeting(selectedFile, (message) => {
        setState({ status: AppStatus.ANALYZING, message });
      });
      setAnalysis(result);
      setState({ status: AppStatus.SUCCESS });
    } catch (error: any) {
      console.error(error);
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        if (error.message.includes('API Key')) {
            errorMessage = "API Key missing. See console for details.";
        } else if (error.message.includes('413')) {
             errorMessage = "File too large for the API in this environment.";
        } else {
             errorMessage = error.message;
        }
      }
      setState({ status: AppStatus.ERROR, message: errorMessage });
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setState({ status: AppStatus.IDLE });
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-20">
      
      {/* Floating Glass Navbar */}
      <nav className="fixed top-0 w-full z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto glass rounded-2xl px-6 py-3 flex justify-between items-center transition-all duration-300">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleReset}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700 tracking-tight">
              Briefly
            </span>
          </div>
          <div className="flex items-center space-x-4">
             <span className="hidden sm:inline-block text-xs font-semibold text-indigo-700 bg-indigo-50/50 px-3 py-1.5 rounded-full border border-indigo-100 backdrop-blur-sm">
                AI Meeting Assistant
             </span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-32 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          {state.status === AppStatus.IDLE && (
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-md shadow-sm">
                ✨ Powered by Gemini 3 Flash
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-sm">
                Meetings, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
                  Summarized.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100/80 max-w-2xl mx-auto leading-relaxed">
                Transform your audio and video recordings into structured notes, action items, and executive summaries in seconds.
              </p>
            </div>
          )}

          {/* Interaction Container */}
          <div className="flex flex-col items-center justify-center w-full">
            
            {/* 1. Upload View */}
            {state.status === AppStatus.IDLE && (
              <div className="w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            )}

            {/* 2. Processing View */}
            {(state.status === AppStatus.UPLOADING || state.status === AppStatus.ANALYZING) && (
               <div className="w-full max-w-md p-10 glass-card rounded-3xl text-center animate-fade-in relative overflow-hidden">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                    <LoaderIcon className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Analyzing Meeting</h3>
                  <p className="text-slate-500 font-medium mb-8 min-h-[1.5em]">{state.message}</p>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-2/3 animate-[pulse_1.5s_infinite]"></div>
                  </div>
               </div>
            )}

            {/* 3. Error View */}
            {state.status === AppStatus.ERROR && (
               <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-red-100 text-center animate-slide-up">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircleIcon className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
                  <p className="text-slate-500 mb-8">{state.message}</p>
                  <button 
                    onClick={handleReset}
                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Try Again
                  </button>
               </div>
            )}

            {/* 4. Success / Results View */}
            {state.status === AppStatus.SUCCESS && analysis && (
               <AnalysisResult data={analysis} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;