// src/ai/flows/satirize-image.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for transforming a user's image
 * into a satirical, persona-based caricature. It includes a content moderation check.
 *
 * - satirizeImage - The main function to trigger the image satirization.
 * - SatirizeImageInput - The input type for the satirizeImage function.
 * - SatirizeImageOutput - The output type for the satirizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SatirizeImageInputSchema = z.object({
  imageUrl: z.string().describe("A data URI of the user's photo. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  personaName: z.string().describe("The name of the professional persona (e.g., 'Coffee Badger')."),
  personaDescription: z.string().describe("The satirical description of the persona's struggles or behaviors."),
});

export type SatirizeImageInput = z.infer<typeof SatirizeImageInputSchema>;

const SatirizeImageOutputSchema = z.object({
  satirizedImageUrl: z.string().describe("The data URI of the newly generated satirical image."),
});

export type SatirizeImageOutput = z.infer<typeof SatirizeImageOutputSchema>;

export async function satirizeImage(input: SatirizeImageInput): Promise<SatirizeImageOutput> {
  return satirizeImageFlow(input);
}

const satirizeImageFlow = ai.defineFlow(
  {
    name: 'satirizeImageFlow',
    inputSchema: SatirizeImageInputSchema,
    outputSchema: SatirizeImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: input.imageUrl } },
        { text: `Redraw this person in a satirical comic book style that captures the essence of a '${input.personaName}'. 
        This persona is described as: "${input.personaDescription}". 
        Emphasize the satirical and humorous aspects of this professional archetype. The background should be simple and not distract from the character.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      },
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to return a valid image.');
    }
    
    return { satirizedImageUrl: media.url };
  }
);
