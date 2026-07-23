// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createTimer, sleep } from '@cmfx/core';
import { joinClass, nextPalette, type Palette, type StyleProps } from '@cmfx/themes';
import { createMemo, createUniqueId, type JSX, Match, mergeProps, onCleanup, onMount, Show, Switch } from 'solid-js';
import IconError from '~icons/flowbite/close-circle-solid';
import IconSuccess from '~icons/material-symbols/check-circle-rounded';
import IconOK from '~icons/material-symbols/check-rounded';
import IconClose from '~icons/material-symbols/close';
import IconWarning from '~icons/material-symbols/error-rounded';
import IconInfo from '~icons/material-symbols/info-rounded';

import type { BaseRef, RefProps } from '@components/base';
import { useLocale, useOptions } from '@components/context';
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
	 * 等同 close 按钮的操作，如果不存在则直接执行关闭操作
	 */
	cancel(): Promise<void>;

	/**
	 * 等同 OK 按钮上的操作，如果不存在，则不执行任何操作。
	 */
	accept(): Promise<void>;
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
	 *
	 * @reactive
	 * @remarks
	 * 当该值大于 0 时，如果 {#onCancel} 未指定，也会显示取消按钮。
	 */
	duration?: number;

	/**
	 * 警告的类型
	 *
	 * @reactive
	 * @defaultValue 'info'
	 */
	type?: MessageType;

	/**
	 * 点击取消按钮时触发的回调
	 *
	 * @remarks
	 * 如果值为 true，表示显示取消按钮。
	 * 该操作会关闭整个消息框，并当前组件从 DOM 中移除。
	 *
	 * @returns 返回 true 将阻止后续的移除操作。
	 */
	readonly onCancel?: (() => Promise<boolean | undefined>) | true;

	/**
	 * 点击确认按钮时触发的回调
	 *
	 * @remarks
	 * 只有指定该值，才会显示确定按钮。
	 * 该操作会关闭整个消息框，并当前组件从 DOM 中移除。
	 *
	 * @returns 返回 true 将阻止后续的移除操作。
	 */
	readonly onAccept?: () => Promise<boolean | undefined>;
}

/**
 * 信息框，notify 和 alert 的共用组件
 */
export function Message(props: MessageProps): JSX.Element {
	props = mergeProps(
		{
			type: 'info',
			onCancel: props.onCancel ?? (props.duration ? true : undefined),
		} as MessageProps,
		props,
	);

	const l = useLocale();
	const [opt] = useOptions();

	let rootRef: HTMLDivElement;
	let buttonRef: HTMLButtonElement;

	const remove = async () => {
		if (!opt.getTransitionDuration()) {
			return;
		}

		rootRef.style.height = '0';
		await sleep(opt.getTransitionDuration()); // 待动画结束
		rootRef.remove();
	};

	const close = async () => {
		if (typeof props.onCancel === 'function') {
			if (await props.onCancel()) {
				return;
			}
		}
		await remove();
	};

	const accept = async () => {
		if (props.onAccept) {
			if (await props.onAccept()) {
				return;
			}
		}
		await remove();
	};

	onMount(() => {
		const h = rootRef.getBoundingClientRect().height;
		rootRef.style.height = `${h}px`; // 只有明确的高度，transition 动画才能触发。

		if (props.duration && buttonRef) {
			const timeout = props.duration;
			const timer = createTimer(timeout, -100, async (t: number) => {
				const p = ((timeout - t) / timeout) * 100;
				buttonRef.style.background = `conic-gradient(var(--palette-bg-low) 0% ${p}%, var(--palette-bg-high) ${p}% 100%)`;
				if (t <= 0) {
					await remove();
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
						cancel: close,
						accept,
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

					<Show when={props.onCancel || props.onAccept}>
						<div class={styles.actions}>
							<Show when={props.onCancel}>
								<button
									type="button"
									class={styles.btn}
									ref={el => (buttonRef = el)}
									aria-label={l.t('_c.close')}
									onClick={close}
								>
									<IconClose class={joinClass('error', styles.img)} />
								</button>
							</Show>

							<Show when={props.onAccept}>
								<button type="button" class={styles.btn} aria-label={l.t('_c.ok')} onClick={accept}>
									<IconOK class={joinClass(nextPalette(palette(), 1), styles.img)} />
								</button>
							</Show>
						</div>
					</Show>
				</div>

				<Show when={props.body}>
					{c => <div id={contentID} class={styles.body} innerHTML={c().replace(/\n/g, '<br />')} />}
				</Show>
			</div>
		</div>
	);
}
