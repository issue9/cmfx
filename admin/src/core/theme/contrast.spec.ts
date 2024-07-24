// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeContrast, Contrast, getContrast } from './contrast';

test('contrast', () => {
    expect(getContrast('less')).toEqual<Contrast>('less');
    expect(getContrast('not-exists' as any)).toEqual<Contrast>('nopreference');

    changeContrast('more');
    expect(getContrast('less')).toEqual<Contrast>('more');
});
