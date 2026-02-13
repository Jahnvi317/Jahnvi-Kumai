
export enum InputType {
  TEXT = 'TEXT',
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE'
}

export interface GeneratedResult {
  imageUrl: string;
  title: string;
  description: string;
  facts: string[];
}

export interface ProcessingState {
  isProcessing: boolean;
  stage: string;
}

export interface UserInput {
  type: InputType;
  content: string; // text or base64
  fileName?: string;
  mimeType?: string;
}
