// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

export const usernameSchema = z.string().min(2).max(32);

export const sexSchema = z.enum(['male', 'female', 'unknown']);

export type Sex = z.infer<typeof sexSchema>;

export const stateSchema = z.enum(['normal', 'locked', 'deleted']);

export type State = z.infer<typeof stateSchema>;
