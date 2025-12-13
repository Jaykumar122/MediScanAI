'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting structured data from a medical image using OCR and GenAI.
 *
 * - `extractDataFromImage`:  A function that handles the data extraction process.
 * - `ExtractDataFromImageInput`: The input type for the extractDataFromImage function.
 * - `ExtractDataFromImageOutput`: The return type for the extractDataFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDataFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a medical document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // eslint-disable-line prettier/prettier
    ),
});
export type ExtractDataFromImageInput = z.infer<typeof ExtractDataFromImageInputSchema>;

const ExtractDataFromImageOutputSchema = z.object({
  extractedData: z
    .string()
    .describe(
      'The extracted data from the medical image, including medicine name, dosage, and frequency.'
    ),
});
export type ExtractDataFromImageOutput = z.infer<typeof ExtractDataFromImageOutputSchema>;

export async function extractDataFromImage(
  input: ExtractDataFromImageInput
): Promise<ExtractDataFromImageOutput> {
  return extractDataFromImageFlow(input);
}

const ocrTool = ai.defineTool({
  name: 'ocrTool',
  description: 'Extracts text from an image of a medical prescription using OCR.',
  inputSchema: z.object({
    photoDataUri: z
      .string()
      .describe(
        'A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // eslint-disable-line prettier/prettier
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
  return `Extracted Text from Image: Medicine: ExampleMed, Dosage: 100mg, Frequency: Twice daily.`;
});

const extractDataPrompt = ai.definePrompt({
  name: 'extractDataFromImagePrompt',
  input: {schema: ExtractDataFromImageInputSchema},
  output: {schema: ExtractDataFromImageOutputSchema},
  tools: [ocrTool],
  prompt: `You are a medical data extraction expert. Please extract the relevant data from the following medical prescription image, including medicine name, dosage, and frequency using the ocrTool tool to extract the text from the image.\n\nMedical Prescription Image: {{media url=photoDataUri}}\n\nExtracted Data: `,
});

const extractDataFromImageFlow = ai.defineFlow(
  {
    name: 'extractDataFromImageFlow',
    inputSchema: ExtractDataFromImageInputSchema,
    outputSchema: ExtractDataFromImageOutputSchema,
  },
  async input => {
    const {output} = await extractDataPrompt(input);
    return output!;
  }
);
