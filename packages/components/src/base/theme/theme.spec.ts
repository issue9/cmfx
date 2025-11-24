// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { transitionDuration, isReducedMotion, wcag } from './theme';
import '../../tailwind.css'; // 需要启用样式表

test('transitionDuration', () => {
    expect(transitionDuration()).toEqual(300);

    document.documentElement.style.setProperty('--default-transition-duration', '300ms');
    expect(transitionDuration()).toEqual(300);

    document.documentElement.style.setProperty('--default-transition-duration', '300s');
    expect(transitionDuration()).toEqual(300 * 1000);

    document.documentElement.style.setProperty('--default-transition-duration', '300');
    expect(transitionDuration()).toEqual(300);
});

test('isReducedMotion', () => {
    expect(isReducedMotion()).toEqual(false);

    document.documentElement.classList.add('prefers-reduced-motion');
    expect(isReducedMotion(document.documentElement)).toEqual(true);
});

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
