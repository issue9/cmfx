// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { transitionDuration, isReducedMotion } from './theme';

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
