'use server';

/**
 * @fileOverview A Genkit flow that optimizes post content for different social media platforms.
 *
 * - optimizeForPlatform - A function that optimizes post content for a specific platform.
 * - OptimizeForPlatformInput - The input type for the optimizeForPlatform function.
 * - OptimizeForPlatformOutput - The return type for the optimizeForPlatform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeForPlatformInputSchema = z.object({
  content: z.string().describe('The original content of the post.'),
  platform: z.enum(['facebook', 'x']).describe('The social media platform (Facebook or X).'),
});
export type OptimizeForPlatformInput = z.infer<typeof OptimizeForPlatformInputSchema>;

const OptimizeForPlatformOutputSchema = z.object({
  optimizedContent: z.string().describe('The optimized content of the post for the specified platform.'),
});
export type OptimizeForPlatformOutput = z.infer<typeof OptimizeForPlatformOutputSchema>;

export async function optimizeForPlatform(input: OptimizeForPlatformInput): Promise<OptimizeForPlatformOutput> {
  return optimizeForPlatformFlow(input);
}

const optimizeForPlatformPrompt = ai.definePrompt({
  name: 'optimizeForPlatformPrompt',
  input: {schema: OptimizeForPlatformInputSchema},
  output: {schema: OptimizeForPlatformOutputSchema},
  prompt: `You are an expert social media manager.

  You will optimize the following post content for the specified social media platform.

  Original Content: {{{content}}}
  Platform: {{{platform}}}

  If the platform is X (Twitter), keep the post concise and engaging, using relevant hashtags and calls to action, and make sure it is less than 280 characters. if it's more than 280 characters then please shorten it.
  If the platform is Facebook, make the post more detailed and engaging, using a wider range of language and emojis.

  Optimize the post to get maximum engagement.
  `,
});

const optimizeForPlatformFlow = ai.defineFlow(
  {
    name: 'optimizeForPlatformFlow',
    inputSchema: OptimizeForPlatformInputSchema,
    outputSchema: OptimizeForPlatformOutputSchema,
  },
  async input => {
    const {output} = await optimizeForPlatformPrompt(input);
    return output!;
  }
);
