// src/ai/flows/generate-satirical-wit.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating satirical wit for realtors.
 *
 * The flow takes realtor details (name, title, image URL) and a theme as input and generates a satirical wit.
 *
 * - generateSatiricalWit - The main function to generate satirical wit.
 * - GenerateSatiricalWitInput - The input type for the generateSatiricalWit function.
 * - GenerateSatiricalWitOutput - The output type for the generateSatiricalWit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSatiricalWitInputSchema = z.object({
  realtorName: z.string().describe('The name of the realtor.'),
  realtorTitle: z.string().describe('The title of the realtor.'),
  theme: z.string().describe('The theme of the sharing card (e.g., Tactical, Magazine).'),
  realtorImageUrl: z.string().describe('URL for an image of the realtor.'),
});

export type GenerateSatiricalWitInput = z.infer<typeof GenerateSatiricalWitInputSchema>;

const GenerateSatiricalWitOutputSchema = z.object({
  satiricalWit: z.string().describe('The generated satirical wit for the realtor.'),
});

export type GenerateSatiricalWitOutput = z.infer<typeof GenerateSatiricalWitOutputSchema>;

export async function generateSatiricalWit(input: GenerateSatiricalWitInput): Promise<GenerateSatiricalWitOutput> {
  return generateSatiricalWitFlow(input);
}

const generateSatiricalWitPrompt = ai.definePrompt({
  name: 'generateSatiricalWitPrompt',
  input: {schema: GenerateSatiricalWitInputSchema},
  output: {schema: GenerateSatiricalWitOutputSchema},
  prompt: `You are a creative copywriter specializing in satirical wit for realtors at theexecutivejokester.com.

  Given the realtor's name, title, image URL, and the sharing card's theme, generate a unique and humorous satirical wit.
  Make sure that it is no more than 2 sentences long. Be very, very funny.

  Realtor Name: {{{realtorName}}}
  Realtor Title: {{{realtorTitle}}}
  Theme: {{{theme}}}
  Realtor Image URL: {{{realtorImageUrl}}}

  Here's an example of the kind of satirical wit you should generate:
  "I don't just sell homes, I sell the American Dream... slightly overpriced and with a leaky faucet."
  "I'm not saying I'm the best realtor, but my closing rate is higher than my hairline."

  Generate the satirical wit:
  `, 
});

const generateSatiricalWitFlow = ai.defineFlow(
  {
    name: 'generateSatiricalWitFlow',
    inputSchema: GenerateSatiricalWitInputSchema,
    outputSchema: GenerateSatiricalWitOutputSchema,
  },
  async input => {
    const {output} = await generateSatiricalWitPrompt(input);
    return output!;
  }
);
