// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 为内容创建下载功能
 *
 * @param content - 要下载的内容；
 * @param filename - 下载时的文件名；
 * @param mimeType - 内容的 MIME 类型；
 */
export function createDownloadLink(content: string | Blob | ArrayBuffer, filename: string, mimeType?: string): void {
	let blob: Blob;

	if (content instanceof Blob) {
		blob = content;
	} else if (content instanceof ArrayBuffer) {
		blob = new Blob([content], { type: mimeType || 'application/octet-stream' });
	} else {
		blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' });
	}

	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
