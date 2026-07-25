// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createTimer, sleep } from '@cmfx/core';
import { joinClass, type Palette, type StyleProps } from '@cmfx/themes';
import { createMemo, createUniqueId, type JSX, Match, mergeProps, onCleanup, onMount, Show, Switch } from 'solid-js';
import IconError from '~icons/flowbite/close-circle-solid';
import IconSuccess from '~icons/material-symbols/check-circle-rounded';
import IconClose from '~icons/material-symbols/close';
import IconWarning from '~icons/material-symbols/error-rounded';
import IconInfo from '~icons/material-symbols/info-rounded';

import type { BaseRef, RefProps } from '@components/base';
import { Button } from '@components/button/button';
import { useOptions } from '@components/context';
import styles from './style.module.css';

export const messageTypes = ['error', 'warning', 'success', 'info'] as const;

export type MessageType = (typeof messageTypes)[number];

const type2Palette: ReadonlyMap<MessageType, Palette> = new Map<MessageType, Palette>([
	['error', 'error'],
	['warning', 'tertiary'],
	['success', 'primary'],
	['info', 'secondary'],
]);

export interface MessageRef extends BaseRef<HTMLDivElement> {
	/**
	 * 将当前组件从父元素移除
	 */
	close(): Promise<void>;
}

export interface MessageProps extends StyleProps, RefProps<MessageRef> {
	/**
	 * 显示的图标
	 *
	 * @remarks
	 * 如果未指定，则根据 type 自动选择图标。若不想显示图标，可以将此值指定为 false。
	 */
	icon?: JSX.Element | false;

	/**
	 * 标题
	 *
	 * @reactive
	 */
	title: string;

	/**
	 * 内容
	 *
	 * @reactive
	 *
	 * @remarks
	 * 换行符会被替换的为 `<br />`。
	 *
	 * NOTE: 如果直接使用字符串属性，那么其内容中的 '\n' 不会被转义，
	 * 只有字符串变量中的 '\n' 会被转义为 `<br />`。
	 */
	body?: string;

	/**
	 * 持续时间，单位毫秒。
	 */
	readonly duration?: number;

	/**
	 * 警告的类型
	 *
	 * @reactive
	 * @defaultValue 'info'
	 */
	type?: MessageType;

	/**
	 * 关闭组件之前触发的事件
	 *
	 * @returns 返回 true 会阻止组件关闭
	 */
	readonly onClose?: () => Promise<boolean | undefined>;

	/**
	 * 是否显示关闭按钮
	 *
	 * @reactive
	 */
	closeable?: boolean;
}

/**
 * 信息框，notify 和 alert 的共用组件
 */
export function Message(props: MessageProps): JSX.Element {
	props = mergeProps(
		{
			type: 'info',
		} as MessageProps,
		props,
	);

	const [opt] = useOptions();

	let rootRef: HTMLDivElement;

	const remove = async () => {
		if (!opt.getTransitionDuration()) {
			return;
		}

		rootRef.style.height = '0';
		await sleep(opt.getTransitionDuration()); // 待动画结束
		rootRef.remove();
	};

	const close = async () => {
		if (!(await props.onClose?.())) {
			await remove();
		}
	};

	onMount(() => {
		const h = rootRef.getBoundingClientRect().height;
		rootRef.style.height = `${h}px`; // 只有明确的高度，transition 动画才能触发。

		if (props.duration) {
			const timeout = props.duration;
			const timer = createTimer(timeout, -100, async (t: number) => {
				const p = ((timeout - t) / timeout) * 100;
				rootRef.style.background = `linear-gradient(to right, var(--palette-bg) 0% ${p}%, var(--palette-bg-low) ${p}% 100%)`;
				if (t <= 0) {
					await close();
				}
			});
			timer.start();

			rootRef.addEventListener('mouseover', timer.pause);
			rootRef.addEventListener('mouseout', timer.start);

			onCleanup(() => {
				rootRef.removeEventListener('mouseover', timer.pause);
				rootRef.removeEventListener('mouseout', timer.start);
				timer.stop();
			});
		}
	});

	// 当前组件的色盘，由 mergeProps 保证 props.type 始终不为空
	const palette = createMemo(() => type2Palette.get(props.type!)!);

	const titleID = createUniqueId();
	const contentID = createUniqueId();

	/* 保证 left 的图标与标题对齐 */
	let leftRef: HTMLDivElement;
	let labelRef: HTMLDivElement;
	const ob = new ResizeObserver(entries => {
		if (!leftRef) {
			return;
		} // props.icon === false
		leftRef.style.height = `${entries[0]!.borderBoxSize[0].blockSize.toString()}px`;
	});
	onMount(() => ob.observe(labelRef));
	onCleanup(() => ob.disconnect());

	return (
		<div
			class={joinClass(palette(), styles.message, props.class)}
			style={props.style}
			role="alert"
			aria-labelledby={titleID}
			aria-describedby={props.body ? contentID : undefined}
			ref={el => {
				rootRef = el;
				if (props.ref) {
					props.ref({
						root: () => el,
						close: close,
					});
				}
			}}
		>
			<Show when={props.icon !== false}>
				<div class={styles.icon} aria-hidden="true" ref={el => (leftRef = el)}>
					<Switch>
						<Match when={props.icon}>{c => c()}</Match>
						<Match when={props.type === 'error'}>
							<IconError />
						</Match>
						<Match when={props.type === 'warning'}>
							<IconWarning />
						</Match>
						<Match when={props.type === 'success'}>
							<IconSuccess />
						</Match>
						<Match when={props.type === 'info'}>
							<IconInfo />
						</Match>
					</Switch>
				</div>
			</Show>

			<div class={styles.content}>
				<div class={styles.label} ref={el => (labelRef = el)}>
					<p id={titleID}>{props.title}</p>
					<Show when={props.closeable}>
						<Button square kind="fill" onclick={close} class="p-1" palette="error">
							<IconClose />
						</Button>
					</Show>
				</div>

				<Show when={props.body}>
					{c => <div id={contentID} class={styles.body} innerHTML={c().replace(/\n/g, '<br />')} />}
				</Show>
			</div>
		</div>
	);
}
