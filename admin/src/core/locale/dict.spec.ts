// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { flatten } from './dict';

test('flatten', () => {
    const o1 = { x: '1' };
    expect(flatten(o1)).toEqual({ 'x': '1' });

    const o2 = { x: '1', y: { z: '2' } };
    expect(flatten(o2)).toEqual({ 'x': '1', 'y.z': '2' });

    const o3 = {
        x: '1',
        y: { z: '2' },
        yy: {
            z: '3', zz: { z: '4' }
        },
        zz: '4',
        zzz: '5'
    };
    expect(flatten(o3)).toEqual({ 'x': '1', 'y.z': '2', 'yy.z': '3', 'yy.zz.z': '4', 'zz': '4', zzz: '5' });
});
