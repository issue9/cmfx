// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { sleep } from '@core/time';
import { delToken, getToken, state, Token, writeToken } from './token';

test('token', () => {
	const id = 'cmfx-token-name';
	const s = window.sessionStorage;
	expect(getToken(id, s)).toBeUndefined();
	expect(delToken(id, s));

	const t: Token = {
		access_token: 'access',
		access_exp: 1,
		refresh_token: 'refresh',
		refresh_exp: 3,
	};

	const tk = writeToken(t, id, s);
	expect(tk.access_token).toEqual('access');

	const now = Date.now().valueOf();
	const rt = getToken(id, s)!;

	expect(rt.access_token).toEqual('access');
	expect(rt.refresh_token).toEqual('refresh');
	expect(rt.access_exp).toBeGreaterThan(now);
	expect(rt.refresh_exp).toBeGreaterThan(rt.access_exp);

	expect(delToken(id, s));
	expect(getToken(id, s)).toBeUndefined();
});

test('state', async () => {
	const id = 'cmfx-token-name';
	const s = window.sessionStorage;

	const t: Token = {
		access_token: 'access',
		access_exp: 1,
		refresh_token: 'refresh',
		refresh_exp: 2,
	};
	expect(writeToken(t, id, s));
	const rt = getToken(id, s)!;

	expect(state(rt)).toEqual('normal');
	await sleep(1000);
	expect(state(rt)).toEqual('accessExpired');
	await sleep(2 * 1000);
	expect(state(rt)).toEqual('refreshExpired');
});
