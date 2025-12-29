// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import '../../tailwind.css'; // 需要启用样式表
import { wcag } from './theme';

describe('wcag', () => {
    test('2.1', () => {
        expect(wcag('#000', '#fff')).toEqual('21.0');
        expect(wcag('#00f', '#fff')).toEqual('8.6');
    });

    test('apca', () => {
        expect(wcag('#000', '#fff', true)).toEqual('108');
        expect(wcag('#00f', '#fff', true)).toEqual('91');
    });

    test('oklch vs hsl', () => {
        expect(wcag('oklch(80%, 0.2, 3)', 'hsl(20, 2%, 20%)', true)).toBeTruthy();
    });
});
