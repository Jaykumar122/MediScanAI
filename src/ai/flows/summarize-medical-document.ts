'use server';
/**
 * @fileOverview Summarizes uploaded medical documents, extracting key findings, diagnoses, and recommendations.
 * - summarizeMedicalDocument - A function that handles the summarization process.
 * - SummarizeMedicalDocumentInput - The input type for the summarizeMedicalDocument function.
 * - SummarizeMedicalDocumentOutput - The return type for the summarizeMedicalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      'The medical document (PDF or image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the expected format
    ),
});
export type SummarizeMedicalDocumentInput = z.infer<typeof SummarizeMedicalDocumentInputSchema>;

const SummarizeMedicalDocumentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the medical document.'),
});
export type SummarizeMedicalDocumentOutput = z.infer<typeof SummarizeMedicalDocumentOutputSchema>;

export async function summarizeMedicalDocument(
  input: SummarizeMedicalDocumentInput
): Promise<SummarizeMedicalDocumentOutput> {
  return summarizeMedicalDocumentFlow(input);
}

const summarizeMedicalDocumentPrompt = ai.definePrompt({
  name: 'summarizeMedicalDocumentPrompt',
  input: {schema: SummarizeMedicalDocumentInputSchema},
  output: {schema: SummarizeMedicalDocumentOutputSchema},
  prompt: `You are a medical expert specializing in summarizing medical documents.

From the following medical document, extract the patient's name and age, and then summarize the key findings.

Your output must be formatted as follows:
- The first line must be "Name: [Patient's Name]".
- The second line must be "Age: [Patient's Age]".
- After the age, provide a point-by-point summary of key findings, diagnoses, and recommendations.

Medical Document: {{media url=documentDataUri}}
`,
});

const summarizeMedicalDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalDocumentFlow',
    inputSchema: SummarizeMedicalDocumentInputSchema,
    outputSchema: SummarizeMedicalDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizeMedicalDocumentPrompt(input);
    return output!;
  }
);
