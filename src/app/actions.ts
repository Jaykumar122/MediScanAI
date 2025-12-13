'use server';

import { convertImageToTextAndSummarize } from '@/ai/flows/ocr-and-summarize';
import { summarizeMedicalDocument } from '@/ai/flows/summarize-medical-document';
import { chatWithDocument } from '@/ai/flows/chat-with-document';
import { diagnoseImage } from '@/ai/flows/diagnose-image';
import { z } from 'zod';

const actionSchema = z.object({
  fileDataUri: z.string().refine((uri) => uri.startsWith('data:'), {
    message: 'File data must be a valid data URI.',
  }),
  fileType: z.string().min(1),
});

export async function generateSummaryAction(input: {
  fileDataUri: string;
  fileType: string;
}) {
  try {
    const { fileDataUri, fileType } = actionSchema.parse(input);

    if (fileType.startsWith('image/')) {
      const result = await convertImageToTextAndSummarize({
        photoDataUri: fileDataUri,
      });
      return { summary: result.summary, error: null };
    } else if (fileType === 'application/pdf') {
      const result = await summarizeMedicalDocument({
        documentDataUri: fileDataUri,
      });
      return { summary: result.summary, error: null };
    } else {
      return {
        summary: null,
        error: 'Unsupported file type. Please upload an image or PDF.',
      };
    }
  } catch (e: any) {
    console.error('Summarization Error:', e);
    // Handle Zod errors specifically for better feedback
    if (e instanceof z.ZodError) {
      return {
        summary: null,
        error: `Invalid input: ${e.errors.map((err) => err.message).join(', ')}`,
      };
    }
    return {
      summary: null,
      error: e.message || 'An unexpected error occurred during summarization.',
    };
  }
}

const chatActionSchema = z.object({
  documentContent: z.string().min(1),
  message: z.string().min(1),
});

export async function chatAction(input: {
  documentContent: string;
  message: string;
}) {
  try {
    const { documentContent, message } = chatActionSchema.parse(input);
    const result = await chatWithDocument({ documentContent, message });
    return { response: result.response, error: null };
  } catch (e: any) {
    console.error('Chat Error:', e);
    if (e instanceof z.ZodError) {
      return {
        response: null,
        error: `Invalid input: ${e.errors.map((err) => err.message).join(', ')}`,
      };
    }
    return {
      response: null,
      error: e.message || 'An unexpected error occurred during the chat.',
    };
  }
}

const diagnoseImageActionSchema = z.object({
    photoDataUri: z.string().refine((uri) => uri.startsWith('data:'), {
        message: 'Photo data must be a valid data URI.',
    }),
    message: z.string(),
});

export async function diagnoseImageAction(input: {
  photoDataUri: string;
  message: string;
}) {
  try {
    const { photoDataUri, message } = diagnoseImageActionSchema.parse(input);
    const result = await diagnoseImage({ photoDataUri, message });
    return { response: result.response, error: null };
  } catch (e: any) {
    console.error('Image Diagnosis Error:', e);
    if (e instanceof z.ZodError) {
      return {
        response: null,
        error: `Invalid input: ${e.errors.map((err) => err.message).join(', ')}`,
      };
    }
    return {
      response: null,
      error: e.message || 'An unexpected error occurred during image diagnosis.',
    };
  }
}
