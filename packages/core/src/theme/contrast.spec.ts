// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { Config } from '@core/config';
import { changeContrast, Contrast, getContrast } from './contrast';

test('contrast', () => {
    const c = new Config('');

    expect(getContrast(c, 'less')).toEqual<Contrast>('less');

    changeContrast(c, 'more');
    expect(getContrast(c, 'less')).toEqual<Contrast>('more');
});
