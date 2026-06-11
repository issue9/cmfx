// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { createSignal, type JSX, mergeProps, Show, untrack } from 'solid-js';
import IconPicker from '~icons/circum/picker-half';
import IconClose from '~icons/material-symbols/cancel';

import type { BaseProps, BaseRef, RefProps, ValueProps } from '@components/base';
import { joinClass, PropsError } from '@components/base';
import { Button } from '@components/button';
import { ClipboardAPI } from '@components/clipboard';
import { useLocale } from '@components/context';
import { Form } from '@components/form';
import { Choice } from '@components/menu/choice';
import type { ColorSpace } from './space';
import styles from './style.module.css';
import { wcag } from './wcag';

declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: TODO: https://caniuse.com/?search=EyeDropper
		EyeDropper: any;
	}
}

export interface PanelRef extends BaseRef<HTMLDivElement> {
	/**
	 * 切换颜色拾取面板
	 *
	 * @param id - 拾取面板的 id；
	 */
	switchSpace(id: string): void;
}

export interface Base extends Omit<Form.DataProps, 'rounded'>, ValueProps<string>, BaseProps {
	/**
	 * 指定一个用于计算 WCAG 值的颜色
	 *
	 * @remarks
	 * 如果该值不为空，那么在颜色展示区域上的文字会以此颜色值显示，否则使用默认颜色值。
	 * 该值只能是所有 CSS 直接支持的颜色值，不能是 CSS 变量。
	 *
	 * @reactive
	 */
	wcag?: string;

	/**
	 * 指定的颜色拾取面板的类型
	 */
	spaces: ReadonlyArray<ColorSpace>;
}

export interface PanelProps extends Base, RefProps<PanelRef> {
	readonly popover?: false;
}

/**
 * 颜色选取面板
 */
export function Panel(props: PanelProps): JSX.Element {
	for (let i = 0; i < props.spaces.length; i++) {
		for (let j = i + 1; j < props.spaces.length; j++) {
			if (props.spaces[i].id === props.spaces[j].id) {
				throw new PropsError('spaces', '存在重复的 id 属性');
			}
		}
	}

	const field = Form.useField<string>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const l = useLocale();

	const [id, setID] = createSignal(props.spaces[0].id);
	const choiceOptions: Choice.Options<string> = props.spaces.map(space => ({
		type: 'item',
		value: space.id,
		label: l.t(space.localeID),
	}));

	const changeID = (v?: string) => {
		if (v && v !== untrack(id)) {
			setID(v);
		}
	};

	field.onChange(v => {
		if (!v) {
			return;
		}

		// 当前面板包含了当前选中的值
		if (props.spaces.find(v => v.id === id())?.include(v)) {
			return;
		}

		for (const p of props.spaces) {
			if (p.include(v)) {
				changeID(p.id);
				return;
			}
		}
	});

	const [apca, setApca] = createSignal(false);
	let contentRef: HTMLDivElement;
	let mainRef!: HTMLElement;
	let clipboardRef: ClipboardAPI.Ref;

	return (
		<div
			class={joinClass(props.palette, styles['color-panel'], props.class, props.disabled ? styles.disabled : undefined)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
						switchSpace: changeID,
					});
				}
			}}
		>
			<header>
				<div class={styles.start}>
					<div
						onclick={() => clipboardRef.writeText(field.getValue() ?? '')}
						class={styles.value}
						ref={el => (contentRef = el)}
						style={{
							'background-color': field.getValue(),
							color: props.wcag ?? 'var(--palette-fg)',
						}}
					>
						<ClipboardAPI class="self-center" ref={el => (clipboardRef = el)} />
						{field.getValue()}
					</div>
					<Show when={props.wcag}>
						{val => (
							<span
								onclick={() => setApca(!apca())}
								class={styles['wcag-value']}
								title={apca() ? 'WCAG 3.X(APCA)' : 'WCAG 2.X'}
							>
								{wcag(
									field.getValue()?.startsWith('var(--')
										? getComputedStyle(contentRef).getPropertyValue('background-color')
										: (field.getValue() ?? 'transparent'),
									val(),
									apca(),
								)}
							</span>
						)}
					</Show>
				</div>

				<div class={styles.end}>
					<Show when={'EyeDropper' in window}>
						<Button
							kind="border"
							square
							onclick={async () => {
								const eye = new window.EyeDropper();
								const color = new Color((await eye.open()).sRGBHex).toString();
								field.setValue(color);

								// 切换到符合当前颜色的拾取色板
								const picker = props.spaces.find(v => v.include(color));
								if (picker) {
									changeID(picker.id);
								}
							}}
						>
							<IconPicker />
						</Button>
					</Show>
					<Button kind="border" square onclick={() => field.setValue(undefined)}>
						<IconClose />
					</Button>
					<Choice options={choiceOptions} value={id()} onChange={v => changeID(v)} />
				</div>
			</header>

			<main ref={el => (mainRef = el)}>{props.spaces.find(p => p.id === id())?.panel(field, mainRef)}</main>
		</div>
	);
}
