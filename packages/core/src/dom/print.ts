// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import Printd from 'printd';

const css = '.no-print { display: none; }';

/**
 * 打印指定容器的内容
 *
 * @remarks
 * 该操作会调用系统的打印界面，并只显示 container 的内容。
 * 如果需要对内容的样式进行自定义，可通过 cssText 参数传入自定义的 CSS 样式。
 * 对于不想打印的内容，可以使用 `.no-print` 类名来隐藏它们。
 *
 * @param container - 该容器的内容会被打印；
 * @param cssText - 打印时额外的CSS样式；
 */
export function printElement(container: HTMLElement, cssText?: string): void {
	const d = new Printd();
	d.print(container, cssText ? [cssText, css] : [css], undefined, (arg) => {
		arg.launchPrint();
		arg.iframe.remove();
	});
}
