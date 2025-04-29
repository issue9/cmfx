// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeContrast, contrastValues } from './contrast';

test('contrast', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);

    changeContrast(parent, 'more');
    changeContrast(child, 'less');

    expect(parent.style.getPropertyValue('--lightness')).toEqual(contrastValues.get('more')!.toString());
    expect(child.style.getPropertyValue('--lightness')).toEqual(contrastValues.get('less')!.toString());
});
