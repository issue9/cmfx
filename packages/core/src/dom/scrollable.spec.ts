// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { getScollableParent } from './scrollable';

describe('getScollableParent', () => {
    test('any', () => {
        let parent = document.createElement('div');
        let child = document.createElement('div');
        let text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        expect(getScollableParent('any', child)).toBeUndefined();

        parent = document.createElement('div');
        child = document.createElement('div');
        text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        parent.style.setProperty('overflow', 'scroll');
        expect(getScollableParent('any', child)).toEqual(parent);
        expect(getScollableParent('x', child)).toEqual(parent);
        expect(getScollableParent('y', child)).toEqual(parent);
    });

    test('y', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        const text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        parent.style.setProperty('overflow-block', 'scroll');
        expect(getScollableParent('any', child)).toEqual(parent);
        expect(getScollableParent('x', child)).toBeUndefined();
        expect(getScollableParent('y', child)).toEqual(parent);
    });

    test('x', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        const text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        parent.style.setProperty('overflow-x', 'scroll');
        expect(getScollableParent('any', child)).toEqual(parent);
        expect(getScollableParent('y', child)).toBeUndefined();
        expect(getScollableParent('x', child)).toEqual(parent);
    });
});