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
  facebookPost: z.string().optional().describe('The generated Facebook post. Only include if platform is "facebook" or "both".'),
  xPost: z.string().optional().describe('The generated X (Twitter) post. Only include if platform is "x" or "both".'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const generateSocialMediaPostPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are an expert social media manager. Generate one or more engaging social media posts based on the provided topic, platform, and tone.

Topic: {{{topic}}}
{{#if tone}}
Tone: {{{tone}}}
{{/if}}

Your task is to generate content for the following platform(s): {{{platform}}}.

- If the platform is 'facebook', create a Facebook post.
- If the platform is 'x', create an X (formerly Twitter) post.
- If the platform is 'both', create both a Facebook and an X post.

Please adhere to the specific platform conventions. For X, be concise and use relevant hashtags. For Facebook, you can be more detailed.
`,
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
