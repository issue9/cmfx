// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX } from 'solid-js';
import IconClose from '~icons/material-symbols/close';

import styles from './style.module.css';

export interface URLProps {
	size: string;
	url: string;
	del: () => void;
}

/**
 * 根据 URL 生成的预览图
 */
export function PreviewURL(props: URLProps): JSX.Element {
	return (
		<div
			class={styles.preview}
			style={{
				width: props.size,
				height: props.size,
				'background-image': isImageURL(props.url) ? props.url : '',
				'background-size': '100% 100%',
			}}
		>
			<IconClose class={styles.close} onClick={props.del} />
		</div>
	);
}

export interface FileProps {
	size: string;
	file: File;
	del: () => void;
}

/**
 * 根据 {@link File} 生成的预览图
 */
export function PreviewFile(props: FileProps): JSX.Element {
	const [bg, setBG] = createSignal<string>('');

	createEffect(async () => {
		if (props.file.type.startsWith('image/')) {
			setBG((('url("' + (await file2Base64(props.file))) as string) + '")');
		} else {
			setBG('');
		}
	});

	return (
		<div
			class={styles.preview}
			style={{
				width: props.size,
				height: props.size,
				'background-image': bg(),
				'background-size': '100% 100%',
			}}
		>
			<IconClose class={styles.close} onClick={props.del} />
		</div>
	);
}

/**
 * 将文件对象转换为 Base64 字符串
 *
 * @param file - 需要转换的文件对象；
 */
export function file2Base64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
	});
}

const imageExts: ReadonlyArray<string> = ['.jpg', '.jpeg', '.png', '.bmp', '.ico', '.svg'];

function isImageURL(url: string): boolean {
	const index = url.lastIndexOf('.');
	if (index === -1 || index === url.length - 1) {
		return false;
	}

	return imageExts.includes(url.slice(index));
}
