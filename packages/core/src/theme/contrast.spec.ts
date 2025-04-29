// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeContrast, contrastValues } from './contrast';

test('contrast', () => {
    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    parent.appendChild(child1);
    child1.appendChild(child2);

    changeContrast(parent, 'more');
    changeContrast(child1, 'less');
    changeContrast(child2);

    expect(parent.style.getPropertyValue('--lightness')).toEqual(contrastValues.get('more')!.toString());
    expect(child1.style.getPropertyValue('--lightness')).toEqual(contrastValues.get('less')!.toString());
    expect(child2.style.getPropertyValue('--lightness')).toBeFalsy();
});
