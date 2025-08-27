// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { transitionDuration } from './theme';

import '../../tailwind.css'; // 启用样式表

test('transitionDuration', () => {
    expect(transitionDuration()).toEqual(300);

    document.documentElement.style.setProperty('--default-transition-duration', '300ms');
    expect(transitionDuration()).toEqual(300);

    document.documentElement.style.setProperty('--default-transition-duration', '300s');
    expect(transitionDuration()).toEqual(300 * 1000);

    document.documentElement.style.setProperty('--default-transition-duration', '300');
    expect(transitionDuration()).toEqual(300);
});
