// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeContrast, Contrast, getContrast } from './contrast';
import { Config } from '@/core/config';

test('contrast', () => {
    const c = new Config('');

    expect(getContrast(c, 'less')).toEqual<Contrast>('less');

    changeContrast(c, 'more');
    expect(getContrast(c, 'less')).toEqual<Contrast>('more');
});
