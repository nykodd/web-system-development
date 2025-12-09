import { z } from 'zod';
export const noteSchema = z.object({
    content: z.string().min(1, "Content is required"),
    important: z.boolean().optional(),
});
