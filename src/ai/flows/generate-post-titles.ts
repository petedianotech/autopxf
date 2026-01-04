'use server';
/**
 * @fileOverview Generates post titles based on content.
 * 
 * - generatePostTitles - A function that generates titles.
 * - GeneratePostTitlesInput - The input type for the generatePostTitles function.
 * - GeneratePostTitlesOutput - The return type for the generatePostTitles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePostTitlesInputSchema = z.object({
  postContent: z.string().describe('The content of the social media post.'),
  platform: z.enum(['facebook', 'x']).describe('The platform for the titles.'),
});
export type GeneratePostTitlesInput = z.infer<typeof GeneratePostTitlesInputSchema>;

const GeneratePostTitlesOutputSchema = z.object({
  titles: z.array(z.string()).describe('2-3 generated titles.'),
});
export type GeneratePostTitlesOutput = z.infer<typeof GeneratePostTitlesOutputSchema>;

export async function generatePostTitles(input: GeneratePostTitlesInput): Promise<GeneratePostTitlesOutput> {
  return generatePostTitlesFlow(input);
}

const generatePostTitlesPrompt = ai.definePrompt({
  name: 'generatePostTitlesPrompt',
  input: { schema: GeneratePostTitlesInputSchema },
  output: { schema: GeneratePostTitlesOutputSchema },
  prompt: `You are a Senior AI Educator and Technology Explainer for the brand Peterdamianohq. Your audience values clarity, intelligence, and practical insights about AI.

Your task is to generate 2-3 virality-optimized titles for a social media post for the specified platform.

Platform: {{{platform}}}
Post Content:
"""
{{{postContent}}}
"""

Title Rules:
- ≤ 60 characters for X, and slightly more flexible for Facebook.
- Sound intelligent, not loud or clickbaity.
- Create a cognitive gap or challenge a common belief.
- Be highly relevant to the post content.

Example Titles:
- "Why Most AI Advice Is Incomplete"
- "The Real Function of AI Tools"
- "A Better Way to Think About Automation"

Generate the titles based on the provided content.
`,
});

const generatePostTitlesFlow = ai.defineFlow(
  {
    name: 'generatePostTitlesFlow',
    inputSchema: GeneratePostTitlesInputSchema,
    outputSchema: GeneratePostTitlesOutputSchema,
  },
  async (input) => {
    const { output } = await generatePostTitlesPrompt(input);
    return output!;
  }
);
