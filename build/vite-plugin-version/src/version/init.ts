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
 */
export function initVersionCheckWorker(
	update: (info: VersionInfo) => Promise<void>,
	old: VersionInfo,
	save: (info: VersionInfo) => Promise<void>,
): Worker {
	const w = new Worker(new URL('./version_checker.ts', import.meta.url));

	w.addEventListener('message', async e => {
		if (e.data.type === 'UPDATE') {
			const info: VersionInfo = { version: e.data.info.version, buildTime: e.data.info.buildTime };
			await save(info);
			await update(info);
		}
	});

	w.postMessage({ type: 'INIT', ...old });

	return w;
}
