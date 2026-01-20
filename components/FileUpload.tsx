import React, { useCallback, useState } from 'react';
import { UploadIcon, FileAudioIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateAndPassFile = (file: File) => {
    const MAX_SIZE = 500 * 1024 * 1024; // 500MB

    if (file.size > MAX_SIZE) {
      setError("File size exceeds 500MB limit.");
      return;
    }

    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
        setError("Please upload an audio or video file.");
        return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group overflow-hidden
          rounded-3xl border-2 border-dashed transition-all duration-500 ease-out
          ${isDragOver 
            ? 'border-indigo-400 bg-indigo-50/90 scale-[1.02] shadow-2xl shadow-indigo-500/20' 
            : 'border-white/40 bg-white/10 hover:bg-white/20 hover:border-white/60 hover:shadow-xl hover:shadow-indigo-500/10'
          }
          backdrop-blur-md
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept="audio/*,video/*"
          className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileInput}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          {/* Icon Container */}
          <div className={`
            mb-6 p-5 rounded-2xl transition-all duration-500
            ${isDragOver 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 rotate-12 scale-110' 
              : 'bg-white text-indigo-600 shadow-md group-hover:scale-110 group-hover:-rotate-6'
            }
          `}>
            {isDragOver ? (
              <FileAudioIcon className="w-10 h-10" />
            ) : (
              <UploadIcon className="w-10 h-10" />
            )}
          </div>
          
          {/* Text Content */}
          <div className="space-y-2 relative z-10">
            <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDragOver ? 'text-indigo-900' : 'text-white'}`}>
              {isDragOver ? 'Drop file to analyze' : 'Upload Meeting Recording'}
            </h3>
            <p className={`text-sm font-medium transition-colors duration-300 ${isDragOver ? 'text-indigo-600' : 'text-indigo-100'}`}>
              Supports MP3, WAV, M4A, MP4 up to 500MB
            </p>
          </div>

          {/* Decorative button */}
          <div className={`
            mt-8 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
            ${isDragOver
              ? 'bg-indigo-600 text-white opacity-0 translate-y-4'
              : 'bg-white text-indigo-900 shadow-lg hover:shadow-indigo-500/20 hover:bg-indigo-50'
            }
          `}>
            Select File
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50/90 backdrop-blur-sm text-red-700 text-sm font-medium rounded-xl flex items-center justify-center border border-red-200 animate-fade-in shadow-sm">
            <span className="mr-2">⚠️</span> {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;