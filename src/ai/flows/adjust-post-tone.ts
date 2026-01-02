'use server';

/**
 * @fileOverview AI agent for adjusting the tone of a social media post.
 *
 * - adjustPostTone - Adjusts the tone of a social media post.
 * - AdjustPostToneInput - The input type for the adjustPostTone function.
 * - AdjustPostToneOutput - The output type for the adjustPostTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustPostToneInputSchema = z.object({
  postContent: z.string().describe('The content of the social media post.'),
  tone: z
    .string()
    .describe(
      'The desired tone of the post (e.g., formal, casual, humorous).' + 'If unsure, select a tone that is 