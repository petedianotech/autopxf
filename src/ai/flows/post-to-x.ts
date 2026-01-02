'use server';

/**
 * @fileOverview A Genkit flow for posting a message to X (formerly Twitter).
 * 
 * - postToX - A function that posts a tweet.
 * - PostToXInput - The input type for the postToX function.
 * - PostToXOutput - The return type for the postToX function.
 */

import { ai } from '@/ai/genkit';
import { xClient } from '@/lib/x-client';
import { z } from 'genkit';

const PostToXInputSchema = z.object({
  text: z.string().describe('The text content of the tweet.'),
});
export type PostToXInput = z.infer<typeof PostToXInputSchema>;

const PostToXOutputSchema = z.object({
  success: z.boolean().describe('Whether the post was successful.'),
  postId: z.string().optional().describe('The ID of the created post.'),
});
export type PostToXOutput = z.infer<typeof PostToXOutputSchema>;


export async function postToX(input: PostToXInput): Promise<PostToXOutput> {
    return postToXFlow(input);
}


const postToXFlow = ai.defineFlow(
  {
    name: 'postToXFlow',
    inputSchema: PostToXInputSchema,
    outputSchema: PostToXOutputSchema,
  },
  async (input) => {
    try {
      const { data: createdTweet } = await xClient.v2.tweet(input.text);
      console.log('Tweet', createdTweet.id, ':', createdTweet.text);
      return {
        success: true,
        postId: createdTweet.id,
      };
    } catch (e) {
        console.error('Failed to post to X', e);
        return {
            success: false,
        }
    }
  }
);
