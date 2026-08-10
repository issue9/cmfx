// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';

/**
 * 复制内容至剪切版的各种状态
 */
export type State = 'ok' | 'pending' | 'error';

/**
 * 写入剪切板的接口
 */
export interface ClipboardWriter {
	/**
	 * 将文本内容写入剪切版
	 */
	writeText(text: string): Promise<void>;

	/**
	 * 将任意内容写入剪切版
	 */
	write(items: ClipboardItems): Promise<void>;
}

/**
 * 创建 {@link ClipboardWriter} 对象
 *
 * @param setState - 写入状态发生变化时的回调方法；
 * @param reset - 如果设置了该值，那么经过该值指定的毫秒时会重置为 'pending'；
 */
export function createClipboardWriter(setState: (s: State) => void, reset?: number): ClipboardWriter {
	const cb = navigator.clipboard;
	setState(cb ? 'pending' : 'error');

	return {
		async write(items) {
			if (cb) {
				try {
					await cb.write(items);
					setState('ok');
				} catch (err) {
					console.error(err);
					setState('error');
				} finally {
					if (reset) {
						sleep(reset).then(() => setState('pending'));
					}
				}
			}
		},

		async writeText(text) {
			if (cb) {
				try {
					await cb.writeText(text);
					setState('ok');
				} catch (err) {
					console.error(err);
					setState('error');
				} finally {
					if (reset) {
						sleep(reset).then(() => setState('pending'));
					}
				}
			}
		},
	} satisfies ClipboardWriter;
}

export interface ClipboardReader {
	/**
	 * 读取剪切板的文本内容
	 */
	readText(): Promise<string | undefined>;

	/**
	 * 读取剪切版的任意内容
	 */
	read(): Promise<ClipboardItems | undefined>;
}

/**
 * 创建 {@link ClipboardReader} 对象
 *
 * @param setState - 读取状态发生变化时的回调方法；
 * @param reset - 如果设置了该值，那么经过该值指定的毫秒时会重置为 'pending'；
 */
export function createClipboardReader(setState: (s: State) => void, reset?: number): ClipboardReader {
	const cb = navigator.clipboard;
	setState(cb ? 'pending' : 'error');

	return {
		async read() {
			if (cb) {
				try {
					const items = await cb.read();
					setState('ok');
					return items;
				} catch (err) {
					console.error(err);
					setState('error');
				} finally {
					if (reset) {
						sleep(reset).then(() => setState('pending'));
					}
				}
			}
		},

		async readText() {
			if (cb) {
				try {
					const text = await cb.readText();
					setState('ok');
					return text;
				} catch (err) {
					console.error(err);
					setState('error');
				} finally {
					if (reset) {
						sleep(reset).then(() => setState('pending'));
					}
				}
			}
		},
	} satisfies ClipboardReader;
}
