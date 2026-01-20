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
    // Increased limit to 500MB as we now support the Files API for larger uploads
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
          relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept="audio/*,video/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileInput}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-indigo-100' : 'bg-slate-100'}`}>
            {isDragOver ? (
              <FileAudioIcon className="w-8 h-8 text-indigo-600" />
            ) : (
              <UploadIcon className="w-8 h-8 text-slate-500" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-slate-900">
              {isDragOver ? 'Drop audio file here' : 'Upload meeting recording'}
            </h3>
            <p className="text-sm text-slate-500">
              Drag & drop or click to browse
            </p>
          </div>
          
          <div className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Supported: MP3, WAV, M4A, MP4 (Max 500MB)
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center justify-center border border-red-100 animate-fade-in">
            {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;