// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Config } from '@/config';
import { changeMode, getMode } from './mode';

describe('mode', () => {
    const c = new Config(10);

    test('getMode', async () => {
        const v = getMode(c, 'light');
        expect(v).toEqual('light');
    });

    test('changeMode', () => {
        changeMode(c, 'dark');
        const v = getMode(c, 'light');
        expect(v).toEqual('dark');
    });
});