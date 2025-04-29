// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { contrastValues } from './contrast';
import { modeValues } from './mode';
import { Theme } from './theme';
import './theme.css';

describe('Theme', () => {
    test('transitionDuration', () => {
        expect(Theme.transitionDuration(100)).toEqual(100);

        document.documentElement.style.setProperty('--transition-duration', '300ms');
        expect(Theme.transitionDuration(100)).toEqual(300);

        document.documentElement.style.setProperty('--transition-duration', '300s');
        expect(Theme.transitionDuration(100)).toEqual(300 * 1000);

        document.documentElement.style.setProperty('--transition-duration', '300');
        expect(Theme.transitionDuration(100)).toEqual(300);
    });

    test('constructor', () => {
        let t = new Theme(10);

        expect(t.contrast).toBeUndefined();
        expect(t.mode).toBeUndefined();
        expect(t.scheme!.primary).toEqual<number>(10);

        let div = document.createElement('div');
        Theme.apply(div, t);

        expect(div.style.getPropertyValue('--lightness')).toBeFalsy();
        expect(div.style.getPropertyValue('color-scheme')).toBeFalsy();
        expect(div.style.getPropertyValue('--primary')).toEqual('10');

        t = new Theme(10, 'dark', 'more');

        expect(t.contrast).toEqual('more');
        expect(t.mode).toEqual('dark');
        expect(t.scheme!.primary).toEqual<number>(10);

        div = document.createElement('div');
        Theme.apply(div, t);
        expect(div.style.getPropertyValue('--lightness')).toEqual(contrastValues.get('more')!.toString());
        expect(div.style.getPropertyValue('color-scheme')).toEqual(modeValues.get('dark'));
        expect(div.style.getPropertyValue('--primary')).toEqual('10');
    });
});
