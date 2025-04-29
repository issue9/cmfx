// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeScheme, genScheme, genSchemes } from './scheme';

test('changeScheme', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);

    changeScheme(parent, genScheme(20));
    changeScheme(child, genScheme(40));

    expect(parent.style.getPropertyValue('--primary')).toEqual('20');
    expect(child.style.getPropertyValue('--primary')).toEqual('40');
});

test('genScheme', () => {
    let s = genScheme(20);
    expect(s.error).toBeUndefined();
    expect(s.primary).toEqual(20);
    expect(s.secondary).toEqual(80);

    s = genScheme(40, 20,160);
    expect(s.error).toEqual(20);
    expect(s.primary).toEqual(40);
    expect(s.secondary).toEqual(200);
    expect(s.tertiary).toEqual(360);
    expect(s.surface).toEqual(160);

    expect(()=>{
        genScheme(40, 20, 370);
    }).toThrow('参数 step 不能大于 180');
});

test('genSchemes', () => {
    expect(genSchemes(20, 10).length).toEqual(10);
});
