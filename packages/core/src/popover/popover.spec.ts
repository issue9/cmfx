// SPDX-FileCopyrightText: 2025-2026 caixw
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

	test('left-start', () => {
		let p = calcPopoverPosition(elem, anchor, 'left', 'start');
		expect(p).toEqual({ x: -5, y: 5 });

		p = calcPopoverPosition(elem, anchor, 'left', 'start', 1);
		expect(p).toEqual({ x: -6, y: 5 });
	});

	test('right-end', () => {
		let p = calcPopoverPosition(elem, anchor, 'right', 'end');
		expect(p).toEqual({ x: 20, y: 5 });

		p = calcPopoverPosition(elem, anchor, 'right', 'end', 1);
		expect(p).toEqual({ x: 21, y: 5 });
	});

	test('top-start', () => {
		let p = calcPopoverPosition(elem, anchor, 'top', 'start');
		expect(p).toEqual({ x: 5, y: -5 });

		p = calcPopoverPosition(elem, anchor, 'top', 'start', 1);
		expect(p).toEqual({ x: 5, y: -6 });
	});

	test('bottom-center', () => {
		let p = calcPopoverPosition(elem, anchor, 'bottom', 'center');
		expect(p).toEqual({ x: 7.5, y: 20 });

		p = calcPopoverPosition(elem, anchor, 'bottom', 'center', 1);
		expect(p).toEqual({ x: 7.5, y: 21 });
	});

	test('bottom-center-rtl', () => {
		let p = calcPopoverPosition(elem, anchor, 'bottom', 'center', 0, true);
		expect(p).toEqual({ x: 7.5, y: 20 });

		p = calcPopoverPosition(elem, anchor, 'bottom', 'center', 1, true);
		expect(p).toEqual({ x: 7.5, y: 21 });
	});

	test('bottom-start-rtl', () => {
		let p = calcPopoverPosition(elem, anchor, 'bottom', 'start', 0, true);
		expect(p).toEqual({ x: 10, y: 20 });

		p = calcPopoverPosition(elem, anchor, 'bottom', 'start', 1, true);
		expect(p).toEqual({ x: 10, y: 21 });
	});

	test('bottom-end-rtl', () => {
		let p = calcPopoverPosition(elem, anchor, 'bottom', 'end', 0, true);
		expect(p).toEqual({ x: 5, y: 20 });

		p = calcPopoverPosition(elem, anchor, 'bottom', 'end', 1, true);
		expect(p).toEqual({ x: 5, y: 21 });
	});
});
