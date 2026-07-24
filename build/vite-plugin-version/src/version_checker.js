// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// 这是一个在后台运行的 Worker，用于轮询 /version.json 检查版本更新
//
// NOTE: 所有 __XX__ 的内容会被插件替换为实际的值。
//
// 包含了两个事件：
// - INIT: 主线程发送初始化消息，包含当前版本号。
// - UPDATE: 检测到新版本时发送的通知消息。

// 当前缓存的版本号
let currentVersion;

/**
 * 请求 version.json 并返回版本信息
 * 每次请求添加时间戳参数以绕过浏览器缓存
 *
 * @returns {Promise<{ version: string; buildTime: string } | undefined>}
 */
async function fetchVersionInfo() {
	try {
		const url = `/__VERSION_FILE__?t=${Date.now()}`;
		const resp = await fetch(url, {
			signal: AbortSignal.timeout(5000), // 5 秒超时
		});

		if (!resp.ok) {
			console.error(`检测新版本失败： ${resp.status}`);
			return;
		}

		const info = await resp.json();
		if (typeof info.version === 'string') {
			return info;
		}
		console.error('无效的 version.json 格式');
	} catch (error) {
		console.warn(`检查版本失败：${error}`);
	}
}

/**
 * 循环检测逻辑
 */
async function check() {
	const info = await fetchVersionInfo();

	if (info) {
		if (!currentVersion) {
			// 首次运行：初始化当前版本
			currentVersion = info.version;
		} else if (currentVersion !== info.version) {
			// 检测到版本变化，并向主线程发送更新通知
			self.postMessage({
				type: "UPDATE",
				version: info.version,
				buildTime: info.buildTime,
				oldVersion: currentVersion,
			});

			currentVersion = info.version; // 更新缓存的版本号
		}
	}

	// 轮询间隔，单位毫秒，会被实际值替换。
	setTimeout(check, __INTERVAL__);
}

// 监听主线程的消息，用于初始化当前版本。
// 只有主线程触了消息，才会开始检测版本信息。
self.onmessage = (e) => {
	if (e.data.type === 'INIT') {
		currentVersion = e.data.version;
		check();
	}
};
