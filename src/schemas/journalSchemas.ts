import { z } from 'zod';

export const journalSchema = z.object({
    journalId: z.number(),
    email: z.string().email(),
    content: z.string().min(200).max(1000),
});