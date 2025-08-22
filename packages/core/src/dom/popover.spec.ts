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
        let p = calcPopoverPosition(elem, anchor, 'left', 'start');
        expect(p).toEqual({ x: -5, y: 5 });

        p = calcPopoverPosition(elem, anchor, 'left', 'start', 1);
        expect(p).toEqual({ x: -6, y: 5 });
    });

    test('right', () => {
        let p = calcPopoverPosition(elem, anchor, 'right', 'end');
        expect(p).toEqual({ x: 20, y: 5 });

        p = calcPopoverPosition(elem, anchor, 'right', 'end', 1);
        expect(p).toEqual({ x: 21, y: 5 });
    });

    test('top', () => {
        let p = calcPopoverPosition(elem, anchor, 'top', 'start');
        expect(p).toEqual({ x: 5, y: -5 });

        p = calcPopoverPosition(elem, anchor, 'top', 'start', 1);
        expect(p).toEqual({ x: 5, y: -6 });
    });

    test('bottom', () => {
        let p = calcPopoverPosition(elem, anchor, 'bottom', 'center');
        expect(p).toEqual({ x: 7.5, y: 20 });

        p = calcPopoverPosition(elem, anchor, 'bottom', 'center', 1);
        expect(p).toEqual({ x: 7.5, y: 21 });
    });
});
