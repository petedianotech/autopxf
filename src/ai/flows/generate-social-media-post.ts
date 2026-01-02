// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview This flow generates social media posts for different platforms based on a user-provided topic.
 *
 * - generateSocialMediaPost - A function that generates social media posts.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic for the social media post.'),
  platform: z.enum(['facebook', 'x', 'both']).describe('The platform for the social media post.'),
  tone: z.string().describe('The tone of the social media post (e.g., formal, casual, humorous).').optional(),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  facebookPost: z.string().optional().describe('The generated Facebook post.'),
  xPost: z.string().optional().describe('The generated X (Twitter) post.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const generateSocialMediaPostPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are an expert social media manager. Generate engaging social media posts based on the topic, platform, and tone provided.

Topic: {{{topic}}}
Platform: {{{platform}}}
Tone: {{{tone}}}

{{#eq platform "facebook"}}
Facebook Post:
{{/eq}}
{{#eq platform "x"}}
X (Twitter) Post:
{{/eq}}
{{#eq platform "both"}}
Facebook Post:

X (Twitter) Post:
{{/eq}}`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await generateSocialMediaPostPrompt(input);
    return output!;
  }
);
