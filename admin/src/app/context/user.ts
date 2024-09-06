// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createResource } from 'solid-js';

import { API } from '@/core';

/**
 * 用户的基本信息
 */
export interface User {
    id?: number;
    sex?: 'unknown' | 'male' | 'female';
    name?: string;
    nickname?: string;
    language?: string;
    timezone?: string;
    theme?: string;
    avatar?: string;
}

export function createUser(f: API, path: string) {
    return createResource(async () => {
        const r = await f.get<User>(path);
        if (!r.ok) {
            await window.notify(r.body!.title);
            return;
        }
        return r.body as User;
    });
}
