// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeScheme } from './scheme';

test('changeScheme', () => {
    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    parent.appendChild(child1);
    child1.appendChild(child2);

    changeScheme(parent, genScheme(20));
    changeScheme(child1, genScheme(40));
    changeScheme(child2);

    expect(parent.style.getPropertyValue('--primary')).toEqual('20');
    expect(child1.style.getPropertyValue('--primary')).toEqual('40');
    expect(child2.style.getPropertyValue('--primary')).toBeFalsy();
});
