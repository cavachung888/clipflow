export enum ProcessingStatus {
  IDLE = 'IDLE',
  FETCHING_VIDEO = 'FETCHING_VIDEO',
  EXTRACTING_AUDIO = 'EXTRACTING_AUDIO', // Simulate FFmpeg
  TRANSCRIBING = 'TRANSCRIBING', // Simulate FunASR
  REWRITING = 'REWRITING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface VideoMetadata {
  title?: string;
  cover?: string;
  url?: string;
  author?: string;
}
