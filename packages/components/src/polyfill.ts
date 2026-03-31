// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// TODO: safari 暂不支持 requestIdleCallback。
// https://caniuse.com/?search=requestIdleCallback
window.requestIdleCallback =
	window.requestIdleCallback ||
	function reqIdleCallback(cb: IdleRequestCallback) {
		const start = Date.now();
		return setTimeout(() => {
			cb({
				didTimeout: false,
				timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
			});
		}, 1);
	};
