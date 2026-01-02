import { z } from 'zod';

export const createPostSchema = z.object({
  topic: z.string().min(10, {
    message: 'Topic must be at least 10 characters long.',
  }).max(200, {
      message: 'Topic must be at most 200 characters long.',
  }),
  platform: z.enum(['facebook', 'x', 'both']),
  tone: z.string(),
});
