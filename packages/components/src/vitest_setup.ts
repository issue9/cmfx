// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { vi } from 'vitest';

// https://github.com/jsdom/jsdom/issues/3368
window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// https://github.com/jsdom/jsdom/issues/3943
window.requestIdleCallback = window.requestIdleCallback || vi.fn();

// https://github.com/jsdom/jsdom/issues/1422
Element.prototype.scrollBy = Element.prototype.scrollBy || vi.fn();

// https://github.com/jsdom/jsdom/issues/3721
HTMLElement.prototype.showPopover = HTMLElement.prototype.showPopover || vi.fn();
HTMLElement.prototype.hidePopover = HTMLElement.prototype.hidePopover || vi.fn();
