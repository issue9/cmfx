// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { sleep } from '@core/time';
import { Token, delToken, getToken, state, writeToken } from './token';

test('token', () => {
    const tokenName = 'cmfx-token-name';

    expect(getToken(sessionStorage, tokenName)).toBeUndefined();
    expect(delToken(sessionStorage, tokenName));

    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 3
    };
    const tk = writeToken(sessionStorage,t, tokenName);
    expect(tk.access_token).toEqual('access');

    const now = Date.now().valueOf();
    const rt = getToken(sessionStorage, tokenName) as Token;

    expect(rt.access_token).toEqual('access');
    expect(rt.refresh_token).toEqual('refresh');
    expect(rt.access_exp).toBeGreaterThan(now);
    expect(rt.refresh_exp).toBeGreaterThan(rt.access_exp);

    expect(delToken(sessionStorage, tokenName));
    expect(getToken(sessionStorage, tokenName)).toBeUndefined();
});

test('state', async () => {
    const tokenName = 'cmfx-token-name';

    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 2
    };
    expect(writeToken(sessionStorage,t, tokenName));
    const rt = getToken(sessionStorage, tokenName)!;

    expect(state(rt)).toEqual('normal');
    await sleep(1000);
    expect(state(rt)).toEqual('accessExpired');
    await sleep(2 * 1000);
    expect(state(rt)).toEqual('refreshExpired');
});
