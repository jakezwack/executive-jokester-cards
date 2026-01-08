// src/ai/flows/generate-satirical-wit.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating satirical wit for professionals.
 *
 * The flow takes professional details (name, title, image URL) and a theme as input and generates a satirical wit.
 *
 * - generateSatiricalWit - The main function to generate satirical wit.
 * - GenerateSatiricalWitInput - The input type for the generateSatiricalWit function.
 * - GenerateSatiricalWitOutput - The output type for the generateSatiricalWit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSatiricalWitInputSchema = z.object({
  name: z.string().describe('The name of the professional.'),
  title: z.string().describe('The title of the professional.'),
  theme: z.string().describe('The theme of the sharing card (e.g., Tactical, Magazine).'),
  imageUrl: z.string().describe('URL for an image of the professional.'),
});

export type GenerateSatiricalWitInput = z.infer<typeof GenerateSatiricalWitInputSchema>;

const GenerateSatiricalWitOutputSchema = z.object({
  satiricalWit: z.string().describe('The generated satirical wit for the professional.'),
});

export type GenerateSatiricalWitOutput = z.infer<typeof GenerateSatiricalWitOutputSchema>;

export async function generateSatiricalWit(input: GenerateSatiricalWitInput): Promise<GenerateSatiricalWitOutput> {
  return generateSatiricalWitFlow(input);
}

const generateSatiricalWitPrompt = ai.definePrompt({
  name: 'generateSatiricalWitPrompt',
  input: {schema: GenerateSatiricalWitInputSchema},
  output: {schema: GenerateSatiricalWitOutputSchema},
  prompt: `You are a world-class copywriter for theexecutivejokester.com, specializing in "Intelligence-Based Satire" for the 2026 agentic workplace. Your humor is sharp, incisive, and captures the absurdities of a world run by "connected intelligence" and autonomous systems.

Your task is to generate a unique and incisive satirical line for a professional's sharing card. The output must be concise (1-2 sentences).

Professional's Name: {{{name}}}
Professional's Title: {{{title}}}
Theme: {{{theme}}}

To create truly effective "executive-level irony," you must satirize the new corporate norms. Employ these techniques:

1.  **Target "Agentic" Keywords:** Weave in terms from the new corporate lexicon like "Agent Orchestrator," "Process Design," and "A2A Protocol" into humorous, relatable situations.
2.  **Use the "Counter-Lexicon":** Directly reference the human resistance to the agentic workplace with terms like "Coffee Badging," "Bare Minimum Mondays," "Loud Quitting," and "Resenteeism."
3.  **Parody of Form:** Frame the wit as if it were a "Performance Review for a Human Legacy Asset" or an alert from an automated system.
4.  **Linguistic Irony:** Use corporate buzzwords like 'synergy,' 'leverage,' or 'pivot' in absurd, personal contexts. (e.g., "I'm leveraging my core competencies to pivot from this conversation.")

Here are examples of the required style:
- "My agent orchestrator is handling my TPS reports. I'm busy with a strategic coffee badging initiative."
- "Achieved inbox zero by rerouting all emails to the void. It's not a bug, it's a feature of my new A2A protocol."
- "I've been promoted to 'Human Legacy Asset'. I'm basically a vintage classic."
- "Currently observing 'Bare Minimum Monday' as a protest against Tuesday's existence."
- "My only KPI is avoiding meetings that could have been an A2A message."

Now, generate a new satirical line for the given professional.`,
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
