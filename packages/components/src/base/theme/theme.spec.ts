// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { modeValues } from './mode';
import { genScheme } from './scheme';
import { applyTheme, hasTheme, Theme, transitionDuration } from './theme';

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

test('theme', () => {
    let t: Theme = {scheme: genScheme(10)};

    expect(t.mode).toBeUndefined();
    expect(t.scheme!.primary).toEqual<number>(10);

    let div = document.createElement('div');
    applyTheme(div, t);

    expect(hasTheme(div)).toBeTruthy();
    expect(div.style.getPropertyValue('--lightness')).toBeFalsy();
    expect(div.style.getPropertyValue('color-scheme')).toBeFalsy();
    expect(div.style.getPropertyValue('--primary')).toEqual('10');

    t = {
        scheme: genScheme(10),
        mode: 'dark',
    };

    expect(t.mode).toEqual('dark');
    expect(t.scheme!.primary).toEqual<number>(10);

    div = document.createElement('div');
    applyTheme(div, t);
    expect(div.style.getPropertyValue('color-scheme')).toEqual(modeValues.get('dark'));
    expect(div.style.getPropertyValue('--primary')).toEqual('10');
});
