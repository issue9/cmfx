// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: 该文件由插件 vite-plugin-version 自动生成，请勿手动修改！

// 这是一个在后台运行的 Worker，用于轮询 /version.json 检查版本更新
//
// 所有 __XX__ 的内容会被插件替换为实际的值。
//
// 包含了以下几个事件：
// - 发送 INIT: 主线程发送初始化消息，包含当前版本号。
// - 发送 CHECK: 主线程发送刷新消息，请求立即检测版本信息。
// - 发送 PAUSE: 主线程发送暂停消息，暂停版本检测。
// - 接收 UPDATE: 检测到新版本时发送的通知消息。

export interface VersionInfo {
	version: string;
	buildTime: Date;
}

let currentInfo: VersionInfo;

let timeoutID: number | undefined;

/**
 * 请求 version.json 并返回版本信息
 * 每次请求添加时间戳参数以绕过浏览器缓存
 */
async function fetchVersionInfo(): Promise<VersionInfo | undefined> {
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
		console.error('文件 __VERSION_FILE__ 格式无效');
	} catch (error) {
		console.warn(`检查版本失败：${error}`);
	}
}

/**
 * 循环检测逻辑
 */
async function check() {
	if (timeoutID) {
		clearTimeout(timeoutID);
		timeoutID = undefined;
	}

	if (!currentInfo) {
		console.error('未初始化！');
		return;
	}

	const info = await fetchVersionInfo();

	if (info && (currentInfo.version !== info.version || currentInfo.buildTime !== info.buildTime)) {
		// 检测到版本变化，并向主线程发送更新通知
		self.postMessage({
			type: 'UPDATE',
			version: info.version,
			buildTime: info.buildTime,
		});

		currentInfo = info; // 更新缓存的版本号
	}

	// 轮询间隔，单位毫秒，会被实际值替换。
	timeoutID = self.setTimeout(check, __INTERVAL__);
}

// 监听主线程的消息，用于初始化当前版本。
// 只有主线程触了消息，才会开始检测版本信息。
self.addEventListener('message', e => {
	switch (e.data.type) {
		case 'INIT':
			currentInfo = {
				version: e.data.version,
				buildTime: e.data.buildTime,
			};
			check();
			break;
		case 'CHECK':
			check();
			break;
		case 'PAUSE':
			self.clearTimeout(timeoutID);
			break;
		default:
			break;
	}
});
