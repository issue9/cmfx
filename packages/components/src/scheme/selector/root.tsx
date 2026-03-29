// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import equal from 'fast-deep-equal';
import { createEffect, createSignal, For, type JSX } from 'solid-js';

import type { BaseProps, BaseRef, RefProps, Scheme } from '@components/base';
import { joinClass } from '@components/base';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props extends BaseProps, RefProps<Ref> {
	/**
	 * 主题列表
	 */
	schemes: Map<string, Scheme>;

	/**
	 * 当前的主题值
	 *
	 * @reactive
	 */
	value: string | Scheme;

	/**
	 * 修改主题值时触发的事件
	 */
	onChange?: (val: string, old?: string) => void;
}

/**
 * 主题选择组件
 */
export function Root(props: Props): JSX.Element {
	const [value, setValue] = createSignal<string>();

	// 监视外部变化
	createEffect(() => {
		if (typeof props.value === 'string') {
			setValue(props.value);
		} else {
			for (const e of props.schemes.entries()) {
				if (equal(e[1], props.value)) {
					setValue(e[0]);
					return;
				}
			}

			setValue(undefined);
		}
	});

	return (
		<div
			class={joinClass(props.palette, styles.selector, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			<For each={Array.from(props.schemes.entries())}>
				{scheme => {
					return (
						<button
							type="button"
							class={joinClass(undefined, styles.option, value() === scheme[0] ? styles.selected : '')}
							onClick={() => {
								const old = value();
								setValue(scheme[0]);

								if (props.onChange) {
									props.onChange(scheme[0], old);
								}
							}}
						>
							<div class={styles.blocks}>
								<div class={styles.block} style={{ 'background-color': scheme[1].primary }}></div>
								<div class={styles.block} style={{ 'background-color': scheme[1].secondary }}></div>
								<div class={styles.block} style={{ 'background-color': scheme[1].tertiary }}></div>
								<div class={styles.block} style={{ 'background-color': scheme[1].surface }}></div>
							</div>
							<div class={styles.info}>
								<div>{scheme[0]}</div>
							</div>
						</button>
					);
				}}
			</For>
		</div>
	);
}
