// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: 该文件由插件 vite-plugin-version 自动生成，请勿手动修改！

export interface VersionInfo {
	version: string;
	buildTime: Date;
}

/**
 * 初始化版本检测的 web worker
 *
 * @param update 执行更新页面的操作；
 * @param old 旧的版本号信息；
 * @param save 执行保存新版本的操作；
 *
 * @remarks
 * 返回的 Worker 实例可以接受以下几个事件：
 *  - INIT 初始化事件，携带旧的版本号信息；
 *  - CHECK 新求立即检测版本信息；
 *  - PAUSE 暂停版本检测；
 * NOTE: 不需要手动调用 Worker.terminate，会在 pagehide 时自动终止。
 */
export function initVersionCheckWorker(
	update: (info: VersionInfo) => Promise<void>,
	old: VersionInfo,
	save: (info: VersionInfo) => Promise<void>,
): Omit<Worker, 'terminate'> {
	const w = new Worker(new URL('./checker.ts', import.meta.url));

	w.addEventListener('message', async e => {
		if (e.data.type === 'UPDATE') {
			const info: VersionInfo = { version: e.data.info.version, buildTime: e.data.info.buildTime };
			await save(info);
			await update(info);
		}
	});

	w.postMessage({ type: 'INIT', ...old });
	w.postMessage({ type: 'CHECK' });

	// 根据页面状态决定是否需要后台持续进行版本检测
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			w.postMessage({ type: 'PAUSE' });
		} else {
			w.postMessage({ type: 'CHECK' });
		}
	});

	document.addEventListener('pagehide', () => w.terminate());

	return w;
}
