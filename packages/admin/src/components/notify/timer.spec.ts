// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { expect, test } from 'vitest';

import { createTimer } from './timer';

test('createTimer', async() => {
    let isDone = false;
    let tick = 0;

    const t = createTimer(() => {
        isDone = true;
    }, 500, 100, (_: number) => { tick++; });

    expect(isDone).toBeFalsy();
    expect(tick).toEqual(0);

    t.pause();
    await sleep(800);
    expect(isDone).toBeFalsy();
    expect(tick).toEqual(0);

    t.start();
    await sleep(200);
    expect(isDone).toBeFalsy();
    expect(tick>0).toBeTruthy();

    await sleep(700);
    expect(isDone).toBeTruthy();
    expect(tick>4).toBeTruthy();

    expect(()=>createTimer(() => { }, 500, 500)).toThrow('timeout 的值最起码是 2*step');
});
