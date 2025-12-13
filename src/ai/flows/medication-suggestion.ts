'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting medications based on symptoms.
 *
 * The flow takes a list of symptoms as input and returns a list of suggested medications.
 *
 * - `suggestMedications` - A function that takes symptoms as input and returns suggested medications.
 * - `MedicationSuggestionInput` - The input type for the `suggestMedications` function.
 * - `MedicationSuggestionOutput` - The output type for the `suggestMedications` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationSuggestionInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A comma-separated list of symptoms the patient is experiencing.'),
});
export type MedicationSuggestionInput = z.infer<typeof MedicationSuggestionInputSchema>;

const MedicationSuggestionOutputSchema = z.object({
  medications: z
    .string()
    .describe('A comma-separated list of suggested medications based on the symptoms.'),
});
export type MedicationSuggestionOutput = z.infer<typeof MedicationSuggestionOutputSchema>;

export async function suggestMedications(
  input: MedicationSuggestionInput
): Promise<MedicationSuggestionOutput> {
  return suggestMedicationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationSuggestionPrompt',
  input: {schema: MedicationSuggestionInputSchema},
  output: {schema: MedicationSuggestionOutputSchema},
  prompt: `You are a medical expert. Based on the symptoms provided, suggest possible medications.
Symptoms: {{{symptoms}}}

Medications:`,
});

const suggestMedicationsFlow = ai.defineFlow(
  {
    name: 'suggestMedicationsFlow',
    inputSchema: MedicationSuggestionInputSchema,
    outputSchema: MedicationSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
