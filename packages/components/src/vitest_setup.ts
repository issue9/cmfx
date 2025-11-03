// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

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
window.requestIdleCallback = window.requestIdleCallback || function (cb) {
    var start = Date.now();
    return setTimeout(function () {
        cb({
            didTimeout: false,
            timeRemaining: function () {
                return Math.max(0, 50 - (Date.now() - start));
            },
        });
    }, 1);
};
