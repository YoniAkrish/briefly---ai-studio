import React, { useState } from 'react';
import { ProcessingState, AppStatus, MeetingAnalysis } from './types';
import { analyzeMeeting } from './services/geminiService';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { LoaderIcon, AlertCircleIcon, FileAudioIcon } from './components/Icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ProcessingState>({
    status: AppStatus.IDLE,
  });
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setState({ status: AppStatus.ANALYZING, message: "Preparing upload..." });
    
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
        } else if (error.message.includes('Failed to fetch')) {
             errorMessage = "Network error. If uploading a large file, CORS might be restricting direct browser access.";
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Briefly</span>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                MVP Alpha
             </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header (Only show when idle or uploading) */}
          {state.status === AppStatus.IDLE && (
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Turn hours of meetings <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  into seconds of clarity.
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                Upload your meeting recordings. Our AI extracts the summary, action items, and key decisions instantly.
              </p>
            </div>
          )}

          {/* Core Interaction Area */}
          <div className="flex flex-col items-center justify-center">
            
            {/* Uploader View */}
            {state.status === AppStatus.IDLE && (
              <FileUpload onFileSelect={handleFileSelect} />
            )}

            {/* Processing View */}
            {(state.status === AppStatus.UPLOADING || state.status === AppStatus.ANALYZING) && (
               <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-100 text-center animate-pulse">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LoaderIcon className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Meeting</h3>
                  <p className="text-slate-500 text-sm">{state.message || "Please wait..."}</p>
                  <div className="mt-6 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-2 rounded-full w-2/3 animate-[shimmer_2s_infinite]"></div>
                  </div>
               </div>
            )}

            {/* Error View */}
            {state.status === AppStatus.ERROR && (
               <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-red-100 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircleIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Analysis Failed</h3>
                  <p className="text-slate-500 text-sm mb-6">{state.message}</p>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
               </div>
            )}

            {/* Results View */}
            {state.status === AppStatus.SUCCESS && analysis && (
               <AnalysisResult data={analysis} />
            )}
          </div>
        </div>
      </main>

       {/* Footer */}
       <footer className="border-t border-slate-200 bg-white py-8">
         <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
           <p>&copy; {new Date().getFullYear()} Briefly. Powered by Google Gemini.</p>
         </div>
       </footer>
    </div>
  );
};

export default App;