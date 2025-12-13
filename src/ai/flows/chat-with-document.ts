'use server';

/**
 * @fileOverview This file defines a Genkit flow for chatting with a medical document.
 *
 * - `chatWithDocument`:  A function that handles the chat interaction.
 * - `ChatWithDocumentInput`: The input type for the chatWithDocument function.
 * - `ChatWithDocumentOutput`: The return type for the chatWithDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatWithDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the medical document.'),
  message: z.string().describe('The user\'s message or question.'),
});
export type ChatWithDocumentInput = z.infer<typeof ChatWithDocumentInputSchema>;

const ChatWithDocumentOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s message.'),
});
export type ChatWithDocumentOutput = z.infer<
  typeof ChatWithDocumentOutputSchema
>;

export async function chatWithDocument(
  input: ChatWithDocumentInput
): Promise<ChatWithDocumentOutput> {
  return chatWithDocumentFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatWithDocumentPrompt',
  input: { schema: ChatWithDocumentInputSchema },
  output: { schema: ChatWithDocumentOutputSchema },
  prompt: `You are a helpful medical assistant. A user has provided a medical document summary and wants to ask questions about it. Answer the user's questions based on the provided document content.

Document Content:
---
{{{documentContent}}}
---

User's Question:
---
{{{message}}}
---

Your Answer:`,
});

const chatWithDocumentFlow = ai.defineFlow(
  {
    name: 'chatWithDocumentFlow',
    inputSchema: ChatWithDocumentInputSchema,
    outputSchema: ChatWithDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);
