// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test, vi } from 'vitest';

import { calcPopoverPosition } from './popover';

describe('calcPopoverPosition', () => {
    const elem = document.createElement('div');
    elem.getBoundingClientRect = vi.fn(() => {
        return new DOMRect(0, 0, 10, 10);
    });
    document.body.appendChild(elem);

    const anchor = new DOMRect(5, 5, 15, 15);

    test('left', () => {
        let p = calcPopoverPosition(elem, anchor, 'left');
        expect(p).toEqual({ x: -5, y: 5 });

        p = calcPopoverPosition(elem, anchor, 'left', 1);
        expect(p).toEqual({ x: -6, y: 5 });
    });

    test('right', () => {
        let p = calcPopoverPosition(elem, anchor, 'right');
        expect(p).toEqual({ x: 20, y: 5 });

        p = calcPopoverPosition(elem, anchor, 'right', 1);
        expect(p).toEqual({ x: 21, y: 5 });
    });

    test('top', () => {
        let p = calcPopoverPosition(elem, anchor, 'top');
        expect(p).toEqual({ x: 5, y: -5 });

        p = calcPopoverPosition(elem, anchor, 'top', 1);
        expect(p).toEqual({ x: 5, y: -6 });
    });

    test('bottom', () => {
        let p = calcPopoverPosition(elem, anchor, 'bottom');
        expect(p).toEqual({ x: 5, y: 20 });

        p = calcPopoverPosition(elem, anchor, 'bottom', 1);
        expect(p).toEqual({ x: 5, y: 21 });
    });
});
