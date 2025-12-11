import { z } from 'zod';
export const statusSchema = z.object({
    stat_name: z.string().min(1, "Content is required")
});
