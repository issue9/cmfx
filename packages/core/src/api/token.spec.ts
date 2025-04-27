// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { sleep } from '@/time';
import { Token, delToken, getToken, state, writeToken } from './token';
import { Config } from '@/config';

test('token', () => {
    const c = new Config('cmfx-token-name', '');

    expect(getToken(c)).toBeUndefined();
    expect(delToken(c));

    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 3
    };
    const tk = writeToken(t, c);
    expect(tk.access_token).toEqual('access');

    const now = Date.now().valueOf();
    const rt = getToken(c) as Token;

    expect(rt.access_token).toEqual('access');
    expect(rt.refresh_token).toEqual('refresh');
    expect(rt.access_exp).toBeGreaterThan(now);
    expect(rt.refresh_exp).toBeGreaterThan(rt.access_exp);

    expect(delToken(c));
    expect(getToken(c)).toBeUndefined();
});

test('state', async () => {
    const c = new Config('cmfx-token-name', '');

    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 2
    };
    expect(writeToken(t, c));
    const rt = getToken(c)!;

    expect(state(rt)).toEqual('normal');
    await sleep(1000);
    expect(state(rt)).toEqual('accessExpired');
    await sleep(2 * 1000);
    expect(state(rt)).toEqual('refreshExpired');
});
