// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';
import { Token, TokenState, delToken, getToken, state, writeToken } from './token';
import { sleep } from '@/utils/time';

test('token', async ()=>{
    expect(await getToken()).toBeNull();
    expect(await delToken());

    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 3 
    };
    expect(await writeToken(t));

    const now = Date.now().valueOf();
    const rt = await getToken() as Token;

    expect(rt.access_token).toEqual('access');
    expect(rt.refresh_token).toEqual('refresh');
    expect(rt.access_exp).toBeGreaterThan(now);
    expect(rt.refresh_exp).toBeGreaterThan(rt.access_exp);

    expect(await delToken());
    expect(await getToken()).toBeNull();
});

test('state', async ()=>{
    const t: Token = {
        access_token: 'access',
        access_exp: 1,
        refresh_token: 'refresh',
        refresh_exp: 2
    };
    expect(await writeToken(t));
    const rt = await getToken() as Token;

    expect(state(rt)).toEqual(TokenState.Normal);
    await sleep(1000);
    expect(state(rt)).toEqual(TokenState.AccessExpired);
    await sleep(2*1000);
    expect(state(rt)).toEqual(TokenState.RefreshExpired);
});