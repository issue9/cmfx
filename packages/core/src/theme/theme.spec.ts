// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Contrast, contrastValues } from './contrast';
import { Mode, modeValues } from './mode';
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
        const t = new Theme(10);

        expect(t.contrast).toEqual<Contrast>('nopreference');
        expect(t.mode).toEqual<Mode>('system');
        expect(t.scheme.primary).toEqual<number>(10);

        const div = document.createElement('div');
        Theme.apply(div, t);

        expect(div.style.getPropertyValue('--lightness')).toEqual(contrastValues.get('nopreference')!.toString());
        expect(div.style.getPropertyValue('color-scheme')).toEqual(modeValues.get('system'));
        expect(div.style.getPropertyValue('--primary')).toEqual('10');
    });
});
