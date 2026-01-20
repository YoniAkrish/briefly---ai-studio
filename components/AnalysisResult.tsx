import React from 'react';
import { MeetingAnalysis, ActionItem } from '../types';
import { ClipboardIcon, CheckCircleIcon } from './Icons';

interface AnalysisResultProps {
  data: MeetingAnalysis;
}

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const colors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const defaultColor = 'bg-slate-100 text-slate-800 border-slate-200';
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors[priority as keyof typeof colors] || defaultColor}`}>
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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-md border border-indigo-100">
              {data.sentiment}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            {data.attendees && data.attendees.length > 0 ? (
               <span>Attendees: {data.attendees.join(', ')}</span>
            ) : (
                <span>No specific attendees detected.</span>
            )}
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Copy to Clipboard"
        >
          <ClipboardIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Summary Card */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <span className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></span>
              Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.summary}
            </p>
          </section>

          {/* Key Points Card */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <span className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></span>
              Key Highlights
            </h2>
            <ul className="space-y-3">
              {data.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start text-slate-700">
                  <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Decisions Card */}
           <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
              Decisions Made
            </h2>
             {data.decisions.length > 0 ? (
                <ul className="space-y-3">
                {data.decisions.map((decision, idx) => (
                    <li key={idx} className="flex items-start text-slate-700">
                    <CheckCircleIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    {decision}
                    </li>
                ))}
                </ul>
             ) : (
                 <p className="text-slate-500 italic">No formal decisions detected.</p>
             )}
          </section>

        </div>

        {/* Sidebar Column (Action Items) */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Action Items</h2>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {data.actionItems.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {data.actionItems.map((item: ActionItem, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <p className="text-sm font-medium text-slate-800 mb-2">{item.task}</p>
                  <div className="flex items-center text-xs text-slate-500">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center mr-2 text-[10px] font-bold">
                      {item.assignee.charAt(0)}
                    </div>
                    {item.assignee}
                  </div>
                </div>
              ))}

              {data.actionItems.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No action items found.</p>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResult;