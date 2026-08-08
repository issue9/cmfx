// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { StyleProps } from '@cmfx/cdk';
import { type ChangeFunc, Code, type RefProps, useLocale, useOptions } from '@cmfx/components';
import { createMemo, type JSX } from 'solid-js';

import { fileObject2Map, type MDXFileObject } from './file';

export interface LocalizedMDXDocProps extends RefProps<HTMLElement>, StyleProps {
	/**
	 * 通过 import.meta.glob 加载的单一内容的多语言对象
	 *
	 * @reactive
	 */
	docs: MDXFileObject;

	/**
	 * 语言切换完成时触发的事件
	 */
	readonly onSwitch?: ChangeFunc<string>;
}

/**
 * 本地化的 MDX 文档渲染组件
 */
export function LocalizedMDXDoc(props: LocalizedMDXDocProps): JSX.Element {
	const l = useLocale();
	const [, origin] = useOptions();
	let lang: string | undefined;

	// 根据语言变化切换不同版本的 mdx 内容
	const comp = createMemo(() => {
		const articles = fileObject2Map(props.docs);
		const locales = Array.from(articles.keys());
		const loc = l;

		if (articles.size < 2) {
			// < 2 表示只有一种语言
			return articles.values().next().value;
		}

		const curr = loc.match(locales, origin.locale);
		if (curr !== lang && props.onSwitch) {
			queueMicrotask(() => {
				props.onSwitch?.(curr, lang);
				lang = curr;
			});
		}

		return articles.get(curr) ?? articles.values().next().value;
	});

	return (
		<article class={props.class} style={props.style} ref={props.ref}>
			{comp()({ components: { pre: preCode } })}
		</article>
	);
}

function preCode(props: { children: HTMLElement }): JSX.Element {
	return (
		<Code
			decorates={[Code.createToolbarDecorate('copy', 'fit', 'print', 'expand', 'title'), Code.borderDecorate]}
			ln={0}
			filename={props.children.className.slice('language-'.length) as Code.Language}
		>
			{props.children.innerText}
		</Code>
	);
}
