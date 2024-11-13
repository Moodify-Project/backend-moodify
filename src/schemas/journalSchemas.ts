import { z } from 'zod';

export const journalSchema = z.object({
    journalId: z.string(),
    emailAuthor: z.string().email(),
    content: z.string().min(200).max(1000),
});