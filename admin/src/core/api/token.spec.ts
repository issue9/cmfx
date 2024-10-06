// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { sleep } from '@/core/time';

import { Token, TokenState, delToken, getToken, state, writeToken } from './token';

test('token', () => {
    expect(getToken()).toBeUndefined();
    expect(delToken());

    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 3
    };
    const tk = writeToken(t);
    expect(tk.access_token).toEqual('access');

    const now = Date.now().valueOf();
    const rt = getToken() as Token;

    expect(rt.access_token).toEqual('access');
    expect(rt.refresh_token).toEqual('refresh');
    expect(rt.access_exp).toBeGreaterThan(now);
    expect(rt.refresh_exp).toBeGreaterThan(rt.access_exp);

    expect(delToken());
    expect(getToken()).toBeUndefined();
});

test('state', async () => {
    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 2
    };
    expect(writeToken(t));
    const rt = getToken()!;

    expect(state(rt)).toEqual(TokenState.Normal);
    await sleep(1000);
    expect(state(rt)).toEqual(TokenState.AccessExpired);
    await sleep(2 * 1000);
    expect(state(rt)).toEqual(TokenState.RefreshExpired);
});
