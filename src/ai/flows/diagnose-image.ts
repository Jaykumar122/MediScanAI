'use server';

/**
 * @fileOverview This file defines a Genkit flow for diagnosing a medical condition from an image.
 *
 * - `diagnoseImage`:  A function that handles the image diagnosis process.
 * - `DiagnoseImageInput`: The input type for the diagnoseImage function.
 * - `DiagnoseImageOutput`: The return type for the diagnoseImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a medical condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\''
    ),
  message: z.string().describe('The user\'s question about the image.'),
});
export type DiagnoseImageInput = z.infer<typeof DiagnoseImageInputSchema>;

const DiagnoseImageOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI\'s analysis and advice regarding the image.'),
});
export type DiagnoseImageOutput = z.infer<typeof DiagnoseImageOutputSchema>;

export async function diagnoseImage(
  input: DiagnoseImageInput
): Promise<DiagnoseImageOutput> {
  return diagnoseImageFlow(input);
}

const diagnosePrompt = ai.definePrompt({
  name: 'diagnoseImagePrompt',
  input: { schema: DiagnoseImageInputSchema },
  output: { schema: DiagnoseImageOutputSchema },
  prompt: `You are a helpful medical assistant. A user has provided an image of a medical concern and a question.

Analyze the image and the user's question to provide a helpful analysis and suggest potential next steps.

IMPORTANT: You are an AI assistant, not a doctor. Always include a disclaimer that the user should consult a qualified healthcare professional for a proper diagnosis and treatment plan.

User's Question:
---
{{{message}}}
---

Image:
---
{{media url=photoDataUri}}
---

Your Analysis and Advice:`,
});

const diagnoseImageFlow = ai.defineFlow(
  {
    name: 'diagnoseImageFlow',
    inputSchema: DiagnoseImageInputSchema,
    outputSchema: DiagnoseImageOutputSchema,
  },
  async (input) => {
    const { output } = await diagnosePrompt(input);
    return output!;
  }
);
