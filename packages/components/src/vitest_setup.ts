// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: class ResizeObserver {
        callback: ResizeObserverCallback;
        constructor(callback: ResizeObserverCallback) {
            this.callback = callback;
        }
        observe() { }
        unobserve() { }
        disconnect() { }
    },
});
