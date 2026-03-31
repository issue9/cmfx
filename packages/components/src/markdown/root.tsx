// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { parse, type Token } from 'marked';
import { createEffect, createSignal, type JSX } from 'solid-js';

import type { BaseProps, BaseRef, RefProps } from '@components/base';
import { Code } from '@components/code';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLElement>;

export interface Props extends BaseProps, RefProps<Ref> {
	/**
	 * markdown 文本内容
	 */
	text?: string;
}

/**
 * 预览 markdown 文档的组件
 *
 * @remarks
 * 需要需要支持代码高亮，可参考 {@link Code} 的实现。
 */
export function Root(props: Props): JSX.Element {
	const [html, setHTML] = createSignal(props.text);

	createEffect(() => {
		const ht = parse(props.text || '', { async: false, walkTokens: code() });
		setHTML(ht);
	});

	return <article innerHTML={html()} />;
}

function code() {
	return async (token: Token) => {
		switch (token.type) {
			case 'code': {
				Object.assign(token, {
					type: 'html',
					block: true,
					text: await Code.highlight(token.text, token.lang, undefined, true, styles.code),
				});
				break;
			}
		}
	};
}
