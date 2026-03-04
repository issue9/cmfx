// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { handleEvent, joinClass, RefProps } from '@components/base';
import { useLocale } from '@components/context';
import { AProps, BProps, Button, Props as ButtonProps, Ref as ButtonRef, presetProps } from './button';
import styles from './style.module.css';

export interface Ref<A extends boolean = false> {
	/**
	 * 按钮元素
	 */
	button(): ButtonRef<A>;

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

export type Props =
	| (Base & Omit<AProps, 'ref'> & RefProps<Ref<true>>)
	| (Base & Omit<BProps, 'ref'> & RefProps<Ref<false>>);

/**
 * 带确认功能的按钮
 */
export function ConfirmButton(props: Props) {
	props = mergeProps(presetProps, props) as Props;
	const l = useLocale();
	let popRef: HTMLDivElement;
	let btnRef: ButtonRef<true> | ButtonRef<false>;

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
	const confirm: ButtonProps['onclick'] = e => {
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
			<Button
				ref={(el: ButtonRef<true> | ButtonRef<false>) => {
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
			</Button>

			<div
				popover="auto"
				ref={el => {
					popRef = el;
				}}
				class={joinClass(props.palette, styles['confirm-panel'])}
			>
				{props.prompt ?? l.t('_c.areYouSure')}
				<div class={styles['confirm-actions']}>
					<Button palette="secondary" onclick={() => popRef.hidePopover()}>
						{props.cancel ?? l.t('_c.cancel')}
					</Button>

					<Button
						palette="primary"
						ref={el => {
							el.root().autofocus = true;
						}}
						onclick={confirm}
					>
						{props.ok ?? l.t('_c.ok')}
					</Button>
				</div>
			</div>
		</>
	);
}
