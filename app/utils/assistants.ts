"use server";

import openai from "./openai";
import {
  Assistant,
  AssistantCreateParams,
  AssistantUpdateParams,
  Thread,
  ThreadMessage,
  ThreadRun,
  ThreadRunOptions,
  FileResponse,
} from "./definitions";

/**
 * Creates a new assistant.
 * 
 * @param params - Parameters for creating a new assistant, including name, description, model, and optional tools.
 * @returns A promise that resolves to the newly created assistant.
 * @throws Throws an error if the assistant creation fails.
 */
export async function createAssistant(
  params: AssistantCreateParams
): Promise<Assistant> {
  try {
    const response = await openai.request<AssistantCreateParams, Assistant>({
      method: "post",
      path: "/assistants",
      headers: { "OpenAI-Beta": "assistants=v2" },
      body: params,
    });
    return response as Assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}

/**
 * Retrieves details of an existing assistant by its ID.
 * 
 * @param assistantId - The unique identifier of the assistant.
 * @returns A promise that resolves to the assistant's details.
 * @throws Throws an error if retrieving the assistant fails.
 */
export async function getAssistant(assistantId: string): Promise<Assistant> {
  try {
    const response = await openai.request<unknown, Assistant>({
      method: "get",
      path: `/assistants/${assistantId}`,
      headers: { "OpenAI-Beta": "assistants=v2" },
    });
    return response as Assistant;
  } catch (error) {
    console.error("Error retrieving assistant:", error);
    throw error;
  }
}

/**
 * Updates an existing assistant.
 * 
 * @param assistantId - The unique identifier of the assistant to update.
 * @param updates - The fields to update, such as name, description, and tools.
 * @returns A promise that resolves to the updated assistant.
 * @throws Throws an error if the assistant update fails.
 */
export async function updateAssistant(
  assistantId: string,
  updates: AssistantUpdateParams
): Promise<Assistant> {
  try {
    const response = await openai.request<AssistantUpdateParams, Assistant>({
      method: "post",
      path: `/assistants/${assistantId}`,
      headers: { "OpenAI-Beta": "assistants=v2" },
      body: updates,
    });
    return response as Assistant;
  } catch (error) {
    console.error("Error updating assistant:", error);
    throw error;
  }
}

/**
 * Deletes an existing assistant by its ID.
 * 
 * @param assistantId - The unique identifier of the assistant to delete.
 * @returns A promise that resolves when the assistant is deleted.
 * @throws Throws an error if the assistant deletion fails.
 */
export async function deleteAssistant(assistantId: string): Promise<void> {
  try {
    await openai.request<void, void>({
      method: "delete",
      path: `/assistants/${assistantId}`,
      headers: { "OpenAI-Beta": "assistants=v2" },
    });
  } catch (error) {
    console.error("Error deleting assistant:", error);
    throw error;
  }
}

/**
 * Lists all assistants in the project, optionally filtering by query parameters.
 * 
 * @param query - An optional object containing query parameters for filtering assistants.
 * @returns A promise that resolves to an array of assistants.
 * @throws Throws an error if the listing operation fails.
 */
export async function listAssistants(
  query: Record<string, any> = {}
): Promise<Assistant[]> {
  try {
    const response = await openai.request<Record<string, any>, { data: Assistant[] }>({
      method: "get",
      path: "/assistants",
      headers: { "OpenAI-Beta": "assistants=v2" },
      query,
    });
    return response.data;
  } catch (error) {
    console.error("Error listing assistants:", error);
    throw error;
  }
}

/**
 * Creates a new thread for an assistant.
 * 
 * @param assistantId - The unique identifier of the assistant.
 * @param title - The title of the new thread.
 * @param initialMessages - Optional initial messages to include in the thread.
 * @returns A promise that resolves to the created thread.
 * @throws Throws an error if thread creation fails.
 */
export async function createThread(
  assistantId: string,
  title: string,
  initialMessages?: ThreadMessage[]
): Promise<Thread> {
  try {
    const response = await openai.request<
      { title: string; messages?: ThreadMessage[] },
      Thread
    >({
      method: "post",
      path: `/assistants/${assistantId}/threads`,
      headers: { "OpenAI-Beta": "assistants=v2" },
      body: { title, messages: initialMessages },
    });
    return response as Thread;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}

/**
 * Adds a new message to an existing thread.
 * 
 * @param threadId - The unique identifier of the thread.
 * @param message - The message to add to the thread.
 * @returns A promise that resolves to the added message.
 * @throws Throws an error if adding the message fails.
 */
export async function addMessage(
  threadId: string,
  message: ThreadMessage
): Promise<ThreadMessage> {
  try {
    const response = await openai.request<ThreadMessage, ThreadMessage>({
      method: "post",
      path: `/threads/${threadId}/messages`,
      headers: { "OpenAI-Beta": "assistants=v2" },
      body: message,
    });
    return response as ThreadMessage;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

/**
 * Creates a run for a thread using a specified assistant.
 * 
 * @param threadId - The unique identifier of the thread.
 * @param assistantId - The unique identifier of the assistant.
 * @param options - Optional parameters for the run, such as model or instructions.
 * @returns A promise that resolves to the created thread run.
 * @throws Throws an error if thread run creation fails.
 */
export async function createRun(
  threadId: string,
  assistantId: string,
  options?: Omit<ThreadRunOptions, "assistant_id">
): Promise<ThreadRun> {
  try {
    const response = await openai.request<
      { assistant_id: string } & ThreadRunOptions,
      ThreadRun
    >({
      method: "post",
      path: `/threads/${threadId}/runs`,
      headers: { "OpenAI-Beta": "assistants=v2" },
      body: { assistant_id: assistantId, ...(options || {}) },
    });
    return response as ThreadRun;
  } catch (error) {
    console.error("Error creating run:", error);
    throw error;
  }
}

/**
 * Uploads a file to the OpenAI API for use as a tool resource.
 * 
 * @param filePath - The path to the file to upload.
 * @param purpose - The purpose of the file (e.g., "tool resource").
 * @returns A promise that resolves to the uploaded file's metadata.
 * @throws Throws an error if the file upload fails.
 */
export async function uploadFile(
  filePath: string,
  purpose: string
): Promise<FileResponse> {
  try {
    const fs = require("fs");
    const FormData = require("form-data");

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("purpose", purpose);

    const response = await openai.request<FormData, FileResponse>({
      method: "post",
      path: "/files",
      headers: { ...form.getHeaders() },
      body: form,
    });
    return response as FileResponse;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
