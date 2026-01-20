export interface ActionItem {
  task: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface MeetingAnalysis {
  title: string;
  date?: string;
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  decisions: string[];
  sentiment: string;
  attendees: string[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ProcessingState {
  status: AppStatus;
  message?: string;
  progress?: number;
}