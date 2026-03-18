// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';

import type { OptionsAccessor } from '@components/context';
import type { IconSet } from '@components/icon';

export interface Ref {
	/**
	 * 将文本内容写入剪切版
	 */
	writeText(text: string): Promise<void>;

	/**
	 * 将任意内容写入剪切版
	 */
	write(items: Array<ClipboardItem>): Promise<void>;

	/**
	 * 根元素
	 */
	root(): IconSet.RootRef;
}

export function buildRef(root: IconSet.RootRef, opt: OptionsAccessor): Ref {
	return {
		root: () => root,

		writeText: async (text: string): Promise<void> => {
			await writeText2Clipboard(text, ok => {
				root.to(ok ? 'ok' : 'error');
			});

			await sleep(opt.getStays());
			root.to('copy');
		},

		write: async (items: Array<ClipboardItem>): Promise<void> => {
			await write2Clipboard(items, ok => {
				root.to(ok ? 'ok' : 'error');
			});

			await sleep(opt.getStays());
			root.to('copy');
		},
	};
}

/**
 * @param ok - 是否写入成功；
 */
type AfterWrite2Clipboard = (ok?: boolean) => void;

async function writeText2Clipboard(text: string, after?: AfterWrite2Clipboard): Promise<void> {
	let ok = true;
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error(err);
		ok = false;
	}

	if (after) {
		after(ok);
	}
}

async function write2Clipboard(items: Array<ClipboardItem>, after?: AfterWrite2Clipboard): Promise<void> {
	let ok = true;
	try {
		await navigator.clipboard.write(items);
	} catch (err) {
		console.error(err);
		ok = false;
	}

	if (after) {
		after(ok);
	}
}
