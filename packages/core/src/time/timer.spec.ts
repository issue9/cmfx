// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { createTimer } from './timer';

describe('createTimer', () => {
	test('-', async () => {
		let tick = 0;

		const t = createTimer(500, -100, (_: number) => {
			tick++;
		});

		t.start();
		expect(tick).toEqual(0);
		expect(t.value()).toEqual(500);

		t.pause();
		await sleep(800);
		expect(tick).toEqual(0);

		t.start();
		await sleep(210);
		expect(tick > 0).toBeTruthy();
		expect(t.value()).toEqual(300);

		await sleep(700);
		expect(tick > 4).toBeTruthy();

		t.stop();

		expect(() => createTimer(500, 500)).toThrowError('timeout 的值最起码是 2*step');
	});

	test('+', async () => {
		let tick = 0;

		const t = createTimer(500, 100, (_: number) => {
			tick++;
		});

		t.toggle(); // start
		expect(tick).toEqual(0);
		expect(t.value()).toEqual(500);

		t.toggle(); // pause
		await sleep(800);
		expect(tick).toEqual(0);

		t.toggle(); // start
		await sleep(210);
		expect(tick > 0).toBeTruthy();
		expect(t.value()).toEqual(700);

		await sleep(700);
		expect(tick > 4).toBeTruthy();

		t.stop();
	});
});
