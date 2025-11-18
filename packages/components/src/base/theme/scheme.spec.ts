// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeScheme, nextPalette, otherPalettes, getElementPalette, Scheme } from './scheme';

test('changeScheme', () => {
    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    parent.appendChild(child1);
    child1.appendChild(child2);

    changeScheme(parent, { dark: { 'primary-bg': '#000' }, light: { 'primary-bg': '#fff' } } as Scheme);
    changeScheme(child1, { dark: { 'primary-bg': '#111' }, light: { 'primary-bg': '#eee' } } as Scheme);
    changeScheme(child2);

    expect(parent.style.getPropertyValue('--primary-bg')).toEqual('light-dark(#fff, #000)');
    expect(child1.style.getPropertyValue('--primary-bg')).toEqual('light-dark(#eee, #111)');
    expect(child2.style.getPropertyValue('--primary-bg')).toBeFalsy();
});

test('nextPalette', () => {
    expect(nextPalette('error')).toEqual('surface');
    expect(nextPalette('surface')).toEqual('primary');
    expect(nextPalette('secondary')).toEqual('tertiary');
});

test('otherPalettes', () => {
    expect(otherPalettes('error')).toEqual(['primary', 'secondary', 'tertiary', 'surface']);
    expect(otherPalettes('surface')).toEqual(['primary', 'secondary', 'tertiary', 'error']);
    expect(otherPalettes('primary')).toEqual(['secondary', 'tertiary', 'error', 'surface']);
    expect(otherPalettes('secondary')).toEqual(['primary', 'tertiary', 'error', 'surface']);
    expect(otherPalettes('tertiary')).toEqual(['primary', 'secondary', 'error', 'surface']);
});

test('getElementPalette', () => {
    expect(getElementPalette(document.documentElement)).toBeUndefined();

    document.documentElement.classList.add('palette--primary');
    expect(getElementPalette(document.documentElement)).toEqual('primary');
});
