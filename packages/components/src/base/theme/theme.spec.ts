// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { transitionDuration } from './theme';

import '../../tailwind.css'; // 启用样式表

test('transitionDuration', () => {
    expect(transitionDuration(100)).toEqual(100);

    document.documentElement.style.setProperty('--default-transition-duration', '300ms');
    expect(transitionDuration(100)).toEqual(300);

    document.documentElement.style.setProperty('--default-transition-duration', '300s');
    expect(transitionDuration(100)).toEqual(300 * 1000);

    document.documentElement.style.setProperty('--default-transition-duration', '300');
    expect(transitionDuration(100)).toEqual(300);
});
