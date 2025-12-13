'use server';

/**
 * @fileOverview This file defines a Genkit flow for converting image-based medical records into text using OCR
 * and then summarizing the extracted text, including key-value pairs like quantities and units.
 *
 * - `convertImageToTextAndSummarize`:  A function that handles the OCR and summarization process.
 * - `OcrAndSummarizeInput`: The input type for the convertImageToTextAndSummarize function.
 * - `OcrAndSummarizeOutput`: The return type for the convertImageToTextAndSummarize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OcrAndSummarizeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a medical record, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // eslint-disable-line prettier/prettier
    ),
});
export type OcrAndSummarizeInput = z.infer<typeof OcrAndSummarizeInputSchema>;

const OcrAndSummarizeOutputSchema = z.object({
  summary: z.string().describe('A summary of the medical record.'),
});
export type OcrAndSummarizeOutput = z.infer<typeof OcrAndSummarizeOutputSchema>;

export async function convertImageToTextAndSummarize(
  input: OcrAndSummarizeInput
): Promise<OcrAndSummarizeOutput> {
  return ocrAndSummarizeFlow(input);
}

const ocrTool = ai.defineTool(
  {
    name: 'ocrTool',
    description: 'Extracts text from an image of a document using OCR.',
    inputSchema: z.object({
      photoDataUri: z
        .string()
        .describe(
          'A photo of a document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // eslint-disable-line prettier/prettier
        ),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Placeholder implementation for OCR.  Replace with actual OCR service call.
    // For example, call an external OCR API here.
    // Documentation: https://cloud.google.com/vision/docs/ocr
    console.log('Calling OCR service (placeholder)');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate OCR processing time
    return `Extracted Text from Image: This is a sample medical record for John Doe, age 45. Dosage: 20mg, Frequency: Daily, Duration: 1 week.`;
  }
);

const summarizePrompt = ai.definePrompt({
  name: 'summarizeMedicalRecordPrompt',
  input: {schema: OcrAndSummarizeInputSchema},
  output: {schema: OcrAndSummarizeOutputSchema},
  tools: [ocrTool],
  prompt: `You are a medical summarization expert. From the following medical record, extract the patient's name and age, and then summarize the key findings.

Your output must be formatted as follows:
- The first line must be "Name: [Patient's Name]".
- The second line must be "Age: [Patient's Age]".
- After the age, provide a point-by-point summary of key findings, including dosages, frequencies, and durations.

Use the ocrTool tool to extract the text from the image.

Medical Record Image: {{media url=photoDataUri}}

Summary:`,
});

const ocrAndSummarizeFlow = ai.defineFlow(
  {
    name: 'ocrAndSummarizeFlow',
    inputSchema: OcrAndSummarizeInputSchema,
    outputSchema: OcrAndSummarizeOutputSchema,
  },
  async input => {
    const {output} = await summarizePrompt(input);
    return output!;
  }
);
