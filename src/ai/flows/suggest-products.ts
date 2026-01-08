// src/ai/flows/suggest-products.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant products
 * for a given professional persona.
 *
 * - suggestProducts - The main function to suggest products.
 * - SuggestProductsInput - The input type for the suggestProducts function.
 * - SuggestProductsOutput - The output type for the suggestProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductsInputSchema = z.object({
  personaName: z.string().describe("The name of the professional persona (e.g., 'Coffee Badger')."),
  personaDescription: z.string().describe("The satirical description of the persona's struggles or behaviors."),
});

export type SuggestProductsInput = z.infer<typeof SuggestProductsInputSchema>;

const ProductSuggestionSchema = z.object({
    productName: z.string().describe("The call-to-action text for the product suggestion button. Should be witty and engaging. e.g., 'A Mouse Jiggler to Enhance Productivity'"),
    amazonSearchQuery: z.string().describe("A concise Amazon search query for the suggested product. e.g., 'mouse jiggler'"),
});

const SuggestProductsOutputSchema = z.object({
  products: z.array(ProductSuggestionSchema).max(2, "Please suggest at most 2 products."),
});

export type SuggestProductsOutput = z.infer<typeof SuggestProductsOutputSchema>;

export async function suggestProducts(input: SuggestProductsInput): Promise<SuggestProductsOutput> {
  return suggestProductsFlow(input);
}

const suggestProductsPrompt = ai.definePrompt({
  name: 'suggestProductsPrompt',
  input: {schema: SuggestProductsInputSchema},
  output: {schema: SuggestProductsOutputSchema},
  prompt: `You are an expert at finding the perfect, slightly absurd "corporate survival gear" on Amazon. Your task is to suggest 1-2 products that would humorously "solve" the problem for a given professional persona.

Your suggestions should be genuinely useful but framed with a satirical, witty tone.

Persona Name: {{{personaName}}}
Persona Description: {{{personaDescription}}}

Based on this, brainstorm clever product ideas. For each idea, provide a witty call-to-action for the button text ('productName') and a practical, concise search query for Amazon ('amazonSearchQuery').

Example:
Persona: "Pyromancer of Files"
Description: "Finds catharsis in mass-deleting legacy documents."
Output:
{
  "products": [
    {
      "productName": "A Paper Shredder for Ultimate Catharsis",
      "amazonSearchQuery": "heavy duty paper shredder"
    },
    {
      "productName": "An 'Undo' Button for Real Life",
      "amazonSearchQuery": "novelty big red button"
    }
  ]
}

Now, generate suggestions for the provided persona.`,
});

const suggestProductsFlow = ai.defineFlow(
  {
    name: 'suggestProductsFlow',
    inputSchema: SuggestProductsInputSchema,
    outputSchema: SuggestProductsOutputSchema,
  },
  async input => {
    const {output} = await suggestProductsPrompt(input);
    return output!;
  }
);
