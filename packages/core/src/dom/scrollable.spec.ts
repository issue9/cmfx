// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { getScrollableParent } from './scrollable';

describe('getScrollableParent', () => {
    test('any', () => {
        let parent = document.createElement('div');
        let child = document.createElement('div');
        let text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        expect(getScrollableParent('any', child)).toBeUndefined();

        parent = document.createElement('div');
        child = document.createElement('div');
        text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        parent.style.setProperty('overflow', 'scroll');
        expect(getScrollableParent('any', child)).toEqual(parent);
        expect(getScrollableParent('x', child)).toEqual(parent);
        expect(getScrollableParent('y', child)).toEqual(parent);
    });

    test('y', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        const text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        parent.style.setProperty('overflow-block', 'scroll');
        expect(getScrollableParent('any', child)).toEqual(parent);
        expect(getScrollableParent('x', child)).toBeUndefined();
        expect(getScrollableParent('y', child)).toEqual(parent);
    });

    test('x', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        const text = document.createTextNode('text');
        child.appendChild(text);
        parent.appendChild(child);
        parent.style.setProperty('overflow-x', 'scroll');
        expect(getScrollableParent('any', child)).toEqual(parent);
        expect(getScrollableParent('y', child)).toBeUndefined();
        expect(getScrollableParent('x', child)).toEqual(parent);
    });
});
