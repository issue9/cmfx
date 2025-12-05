// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

export const sexSchema = z.enum(['male', 'female', 'unknown']);

export const stateSchema = z.enum(['normal', 'locked', 'deleted']);

export type Sex = z.infer<typeof sexSchema>;

export type State = z.infer<typeof stateSchema>;

export const passportSchema = z.object({
    id: z.string(),
    identity: z.string().min(2).max(32),
});

export const userSchema = z.object({
    id: z.number().min(1).optional(),
    sex: sexSchema,
    state: stateSchema,
    name: z.string().min(2).max(32),
    nickname: z.string().min(2).max(32),
    avatar: z.string().optional(),
    roles: z.array(z.string()).optional(),
    passports: z.array(passportSchema).optional(),
});

/**
 * 用户的基本信息
 */
export type User = z.infer<typeof userSchema>;
