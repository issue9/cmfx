// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// TODO: safari 暂不支持 requestIdleCallback
// https://caniuse.com/?search=requestIdleCallback
// https://github.com/jsdom/jsdom/issues/3943
window.requestIdleCallback =
	window.requestIdleCallback ||
	((cb: IdleRequestCallback): number => {
		const start = Date.now();
		return window.setTimeout(() => {
			cb({
				didTimeout: false,
				timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
			});
		}, 1);
	});

export {};
