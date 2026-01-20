import React from 'react';
import { MeetingAnalysis, ActionItem } from '../types';
import { ClipboardIcon, CheckCircleIcon } from './Icons';

interface AnalysisResultProps {
  data: MeetingAnalysis;
}

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const styles = {
    High: 'bg-rose-100 text-rose-700 border-rose-200 ring-rose-500/20',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/20',
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  };
  
  const defaultStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border font-bold ring-1 ring-inset ${styles[priority as keyof typeof styles] || defaultStyle}`}>
      {priority}
    </span>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const copyToClipboard = () => {
    const text = `
Meeting: ${data.title}
Summary: ${data.summary}

Action Items:
${data.actionItems.map(item => `- [${item.priority}] ${item.task} (${item.assignee})`).join('\n')}

Decisions:
${data.decisions.map(d => `- ${d}`).join('\n')}
    `;
    navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header Card */}
      <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-200/50 transition-colors duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
             <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-200 uppercase tracking-wide">
              {data.sentiment}
            </span>
            <span className="text-slate-400 text-sm">Analysis Completed</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            {data.title}
          </h1>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            {data.attendees && data.attendees.length > 0 && (
               <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200/60 backdrop-blur-sm">
                 <span className="mr-2">👥</span>
                 <span>{data.attendees.join(', ')}</span>
               </div>
            )}
          </div>
        </div>

        <button 
          onClick={copyToClipboard}
          className="relative z-10 flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <ClipboardIcon className="w-4 h-4" />
          <span>Copy Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Summary & Decisions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Executive Summary */}
          <section className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
              </div>
              Executive Summary
            </h2>
            <div className="prose prose-slate prose-lg max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.summary}
              </p>
            </div>
          </section>

          {/* Key Points */}
          <section className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3 text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              Key Highlights
            </h2>
            <ul className="space-y-4">
              {data.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start group">
                  <span className="mt-2 w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="ml-4 text-slate-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

           {/* Decisions */}
           <section className="glass-card rounded-2xl p-8 bg-gradient-to-br from-white to-blue-50/30">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              Decisions Made
            </h2>
             {data.decisions.length > 0 ? (
                <div className="space-y-3">
                {data.decisions.map((decision, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-white/60 rounded-xl border border-blue-100/50 shadow-sm">
                        <div className="mt-0.5 mr-3 bg-blue-500 rounded-full p-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-slate-700 font-medium">{decision}</span>
                    </div>
                ))}
                </div>
             ) : (
                 <p className="text-slate-500 italic px-4 py-2">No formal decisions detected.</p>
             )}
          </section>
        </div>

        {/* Right Column: Action Items (5 cols) */}
        <div className="lg:col-span-5">
          <section className="glass-card rounded-2xl p-8 h-full sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center mr-3 text-rose-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                Action Items
              </h2>
              <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-slate-500/20">
                {data.actionItems.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {data.actionItems.map((item: ActionItem, idx) => (
                <div key={idx} className="group p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <PriorityBadge priority={item.priority} />
                    <div className="flex items-center text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5"></span>
                      {item.assignee === 'Unassigned' ? 'Anyone' : item.assignee}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-indigo-900 transition-colors">
                    {item.task}
                  </p>
                </div>
              ))}

              {data.actionItems.length === 0 && (
                <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No action items found.</p>
                </div>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResult;