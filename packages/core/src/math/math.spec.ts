// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { rand } from './math';

describe('rand', () => {
    test('rand', () => {
        for (let i = 0; i < 10; i++) {
            const v = rand(0, 10, 0);
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThanOrEqual(10);
        }
    });

    test('decimals=1', () => {
        const v = rand(0.1, 10.1, 1);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
        const index = v.toString().lastIndexOf('.');
        expect(v.toString().substring(index).length).toEqual(2);
    });

    test('decimals=3', () => {
        const v = rand(0.1, 10.1, 3);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
        const index = v.toString().lastIndexOf('.');
        expect(v.toString().substring(index).length).toEqual(4);
    });

    test('decimals=0', () => {
        const v = rand(1, 10, 0);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
        const index = v.toString().lastIndexOf('.');
        expect(index).toEqual(-1);
    });
});
