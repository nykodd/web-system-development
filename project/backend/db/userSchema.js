import { z } from 'zod';

export const userSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
    email: z.string().email(),
    created_at: z.date().optional(),
});
