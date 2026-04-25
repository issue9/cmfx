// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import './style.css';
import './polyfill';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// https://github.com/jsdom/jsdom/issues/3368
window.ResizeObserver =
	window.ResizeObserver ||
	class ResizeObserver {
		callback: ResizeObserverCallback;
		constructor(callback: ResizeObserverCallback) {
			this.callback = callback;
		}
		observe() {}
		unobserve() {}
		disconnect() {}
	};

// https://github.com/jsdom/jsdom/issues/3943
window.requestIdleCallback = window.requestIdleCallback || vi.fn();

// https://github.com/jsdom/jsdom/issues/3522
window.matchMedia =
	window.matchMedia ||
	vi.fn(() => {
		return {
			matches: false,
			media: '',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		};
	});

// https://github.com/jsdom/jsdom/issues/1422
Element.prototype.scrollBy = Element.prototype.scrollBy || vi.fn();

// https://github.com/jsdom/jsdom/issues/3721
HTMLElement.prototype.showPopover = HTMLElement.prototype.showPopover || vi.fn();
HTMLElement.prototype.hidePopover = HTMLElement.prototype.hidePopover || vi.fn();

// https://github.com/jsdom/jsdom/issues/3729
// tiptap 需要使用这些方法
class FakeDOMRectList extends Array<DOMRect> implements DOMRectList {
	item(index: number): DOMRect | null {
		return this[index];
	}
}
HTMLElement.prototype.getClientRects = HTMLElement.prototype.getClientRects || (() => new FakeDOMRectList());
HTMLElement.prototype.getBoundingClientRect = HTMLElement.prototype.getBoundingClientRect || (() => new DOMRect());
Range.prototype.getClientRects = Range.prototype.getClientRects || (() => new FakeDOMRectList());
Range.prototype.getBoundingClientRect = Range.prototype.getBoundingClientRect || (() => new DOMRect());

// https://github.com/jsdom/jsdom/issues/1435
// tiptap 需要使用这些方法
document.elementFromPoint = document.elementFromPoint || vi.fn();

// echarts 会警告没有 getContext 的错误
window.HTMLCanvasElement.prototype.getContext = vi.fn();
