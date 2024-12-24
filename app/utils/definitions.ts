export type Tool = {
  type: string;
};

export type ToolResource = Record<string, string | number | boolean>;

export type Assistant = {
  id: string;
  name: string;
  description: string;
  model: string;
  tools?: Tool[];
  tool_resources?: ToolResource;
  created_at: number;
  updated_at: number;
};

export type AssistantCreateParams = {
  name: string;
  description: string;
  model: string;
  tools?: Tool[];
  tool_resources?: ToolResource;
};

export type AssistantUpdateParams = Partial<AssistantCreateParams>;

export type Thread = {
  id: string;
  assistant_id: string;
  title: string;
  messages: ThreadMessage[];
  created_at: number;
};

export enum ThreadMessageRole {
  User = "user",
  Assistant = "assistant",
  System = "system",
}

export type ThreadMessage = {
  role: ThreadMessageRole;
  content: string;
  attachments?: {
    file_id: string;
    tools?: Tool[];
  }[];
};

export type ThreadRun = {
  id: string;
  thread_id: string;
  assistant_id: string;
  model?: string;
  instructions?: string;
  tools?: Tool[];
  created_at: number;
};

export type ThreadRunOptions = {
  model?: string;
  instructions?: string;
  tools?: Tool[];
  [key: string]: any; // Allow for dynamic options
};

export type FileResponse = {
  id: string;
  purpose: string;
  filename: string;
  size: number;
  created_at: number;
  [key: string]: any; // Future-proofing for additional fields
};

export type ErrorResponse = {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
};
