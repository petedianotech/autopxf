'use server';

import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import { createPostSchema } from './types';
import { z } from 'zod';

export async function handleGeneratePost(values: z.infer<typeof createPostSchema>) {
  const validatedFields = createPostSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid input.');
  }

  try {
    const result = await generateSocialMediaPost(validatedFields.data);
    return result;
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post with AI.');
  }
}
