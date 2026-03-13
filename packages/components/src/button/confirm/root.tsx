// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { type JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import type { RefProps } from '@components/base';
import { handleEvent, joinClass } from '@components/base';
import { Button } from '@components/button/button';
import { useLocale } from '@components/context';
import styles from './style.module.css';

export interface Ref<A extends boolean = false> {
	/**
	 * 按钮元素
	 */
	button(): Button.RootRef<A>;

	/**
	 * 弹出对象的元素
	 */
	popover(): HTMLDivElement;
}

interface Base {
	/**
	 * 确认框的提示内容，如果为空会显示一条默认的提示语句。
	 */
	prompt?: JSX.Element;

	/**
	 * 自定义确定按钮上的内容
	 */
	ok?: JSX.Element;

	/**
	 * 自定义取消按钮上的内容
	 */
	cancel?: JSX.Element;
}

export type AnchorProps = Base & Omit<Button.AnchorProps, 'ref'> & RefProps<Ref<true>>;

export type ButtonProps = Base & Omit<Button.ButtonProps, 'ref'> & RefProps<Ref>;

export type Props = AnchorProps | ButtonProps;

/**
 * 带确认功能的按钮
 */
export function Root(props: Props) {
	props = mergeProps(Button.presetRootProps, props) as Props;
	const l = useLocale();
	let popRef: HTMLDivElement;
	let btnRef: Button.RootRef<true> | Button.RootRef<false>;

	if (props.ref) {
		(props.ref as CallableFunction)({
			button: () => btnRef,
			popover: () => popRef,
		});
	}

	const [_, btnProps] = splitProps(props, ['children', 'onclick', 'prompt', 'palette', 'ok', 'cancel', 'ref']);

	onMount(() => {
		if (props.hotkey) {
			Hotkey.bind(props.hotkey, () => {
				btnRef!.root().click();
			});
		}
	});

	onCleanup(() => {
		if (props.hotkey) {
			Hotkey.unbind(props.hotkey);
		}
	});

	const nav = useNavigate();
	const confirm: Button.RootProps['onclick'] = e => {
		if (props.onclick) {
			handleEvent(props.onclick, e);
		}

		if (props.type === 'a') {
			nav(props.href!);
		}

		popRef.hidePopover();
	};

	return (
		<>
			<Button.Root
				ref={(el: Button.RootRef<true> | Button.RootRef<false>) => {
					btnRef = el;
				}}
				{...btnProps}
				palette={props.palette}
				onclick={e => {
					e.preventDefault(); // 取消默认动作，比如 type='a' 时的跳转
					popRef.togglePopover();
					adjustPopoverPosition(popRef, btnRef.root().getBoundingClientRect());
				}}
			>
				{props.children}
			</Button.Root>

			<div
				popover="auto"
				ref={el => {
					popRef = el;
				}}
				class={joinClass(props.palette, styles.panel)}
			>
				{props.prompt ?? l.t('_c.areYouSure')}
				<div class={styles.actions}>
					<Button.Root palette="secondary" onclick={() => popRef.hidePopover()}>
						{props.cancel ?? l.t('_c.cancel')}
					</Button.Root>

					<Button.Root
						palette="primary"
						ref={el => {
							el.root().autofocus = true;
						}}
						onclick={confirm}
					>
						{props.ok ?? l.t('_c.ok')}
					</Button.Root>
				</div>
			</div>
		</>
	);
}
