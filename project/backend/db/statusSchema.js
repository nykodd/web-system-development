import { z } from 'zod';
export const statusSchema = z.object({
    stat_name: z.string().min(1, "Status name is required"),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color (e.g., #eb5a46)").optional(),
    priority: z.number().int().positive().optional(),
});
