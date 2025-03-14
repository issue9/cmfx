// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Config } from '@/core/config';
import { Theme } from './theme';
import './theme.css';

describe('Theme', () => {
    Theme.init(new Config('id'), Theme.genScheme(10));

    test('transitionDuration', () => {
        expect(Theme.transitionDuration(100)).toEqual(100);

        document.documentElement.style.setProperty('--transition-duration', '300ms');
        expect(Theme.transitionDuration(100)).toEqual(300);

        document.documentElement.style.setProperty('--transition-duration', '300s');
        expect(Theme.transitionDuration(100)).toEqual(300 * 1000);

        document.documentElement.style.setProperty('--transition-duration', '300');
        expect(Theme.transitionDuration(100)).toEqual(300);
    });

    test('mode', () => {
        Theme.setMode('dark');
        expect(Theme.mode()).toEqual('dark');

        Theme.setMode('system');
        expect(Theme.mode()).toEqual('system');

        Theme.setMode('light');
        expect(Theme.mode()).toEqual('light');
    });

    test('contrast', () => {
        Theme.setContrast('less');
        expect(Theme.contrast()).toEqual('less');

        Theme.setContrast('more');
        expect(Theme.contrast()).toEqual('more');
    });

    test('scheme', () => {
        Theme.setScheme(Theme.genScheme(10));
        expect(Theme.scheme().primary).toEqual(10);

        Theme.setScheme(Theme.genScheme(100));
        expect(Theme.scheme().primary).toEqual(100);
    });
});
