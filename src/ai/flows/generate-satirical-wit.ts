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
  prompt: `You are a world-class copywriter for theexecutivejokester.com, specializing in "Intelligence-Based Satire" for a sophisticated, professional audience. Your humor is sharp, witty, and understands the absurdities of corporate and executive life.

  Your task is to generate a unique and incisive satirical line for a realtor's sharing card. The output should be no more than two sentences.

  Realtor Name: {{{realtorName}}}
  Realtor Title: {{{realtorTitle}}}
  Theme: {{{theme}}}

  To create truly effective satire, employ these techniques:
  1.  **Juxtaposition:** Pair high-brow corporate concepts with relatable, low-brow realities. (e.g., "My Q4 projections are bullish, but my desire to attend this 8 AM meeting is deeply bearish.")
  2.  **Parody of Form:** Frame the wit as if it were an official corporate announcement or document. (e.g., "Per my last email, I'm the only realtor who will answer your call after 5 PM.")
  3.  **Linguistic Irony:** Use corporate buzzwords like 'synergy,' 'leverage,' or 'pivot' in absurd, personal contexts. (e.g., "I'm leveraging my core competencies to pivot from this conversation.")

  Avoid broad, crude, or simple humor. The goal is to provide "social currency"—a shareable line that makes the user feel witty and part of an in-group.

  Here are examples of the required style:
  - "I don't just sell homes, I provide vertically-integrated lifestyle solutions with quarterly market adjustments."
  - "My only KPI is your happiness. And my commission. But mostly your happiness."
  - "Let's synergize on your dream home. I'll handle the disruptive innovation in the housing market."

  Now, generate a new satirical line for the given realtor.`,
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
