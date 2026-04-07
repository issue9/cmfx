// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import { createEffect, createSignal, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconCollapse from '~icons/material-symbols/collapse-content';
import IconExpand from '~icons/material-symbols/expand-content';
import IconFullScreen from '~icons/material-symbols/fullscreen';
import IconFullScreenExit from '~icons/material-symbols/fullscreen-exit';

import type { RefProps } from '@components/base';
import { Button } from '@components/button/button';
import { presetProps } from '@components/button/common/types';
import { useLocale } from '@components/context';
import { IconSet } from '@components/icon';
import styles from './style.module.css';

export interface Ref extends Button.RootRef<false> {
	/**
	 * 切换图标显示
	 */
	toggle(): Promise<void>;
}

export interface Props extends Omit<Button.ButtonProps, 'onclick' | 'children' | 'ref' | 'square'>, RefProps<Ref> {
	/**
	 * 指定按钮的状态
	 *
	 * @reactive
	 * @remarks
	 * 有些条件下可能会通过外部状态修改按钮的状态，此时可以使用此属性。
	 */
	value?: boolean;

	/**
	 * 执行切换图标的事件
	 *
	 * @remarks
	 * 鼠标点击事件触发此事件。参数为新的状态值，
	 * 返回值表示实际需要显示的状态值，如果是 undefined 则不改变状态。
	 */
	onToggle?: (v: boolean) => Promise<boolean | undefined>;

	/**
	 * 状态 1 的图标
	 *
	 * @reactive
	 */
	on: JSX.Element;

	/**
	 * 状态 2 的图标
	 *
	 * @reactive
	 */
	off: JSX.Element;
}

/**
 * 可在多种状态切换的按钮
 *
 * @remarks
 * 单一元素切换不同的状态，最容易让人误解的地方是：当前的状态图标表示是当前状态，还是切换后的状态。
 * 所以一般情况下应该使用 {@link ./group.ts#Root} 表示不同状态的值，这样会更直接。
 * 除非像全屏这种直接在应用上体现出来的。
 */
export function Root(props: Props): JSX.Element {
	props = mergeProps(presetProps, props);
	const [, btnProps] = splitProps(props, ['onToggle', 'on', 'off', 'value', 'ref']);
	const [val, setVal] = createSignal(props.value);

	// 监视 props.value 的变化
	createEffect(() => setVal(props.value));

	const toggle = async () => {
		let v = !val();

		if (props.onToggle) {
			const vv = await props.onToggle(v);
			if (vv === undefined) {
				return;
			}
			v = vv;
		}

		setVal(v);
	};

	return (
		<Button.Root
			{...btnProps}
			square
			onclick={toggle}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el.root(),
						toggle: async () => toggle(),
					});
				}
			}}
		>
			<IconSet.Root icons={{ on: props.on, off: props.off }} value={val() ? 'on' : 'off'} />
		</Button.Root>
	);
}

export type FullScreenProps = Omit<Props, 'on' | 'off' | 'value' | 'title'>;

/**
 * 切换全屏状态的按钮
 *
 * @remarks
 * 并不是所有的浏览器都支持全屏功能，比如 iOS 系统，在不支持的系统上默认会处于禁用状态。
 */
export function FullScreen(props: FullScreenProps): JSX.Element {
	props = mergeProps({ disabled: !document.fullscreenEnabled }, props);
	const [, p] = splitProps(props, ['ref']);

	const l = useLocale();
	const [fs, setFS] = createSignal(!document.fullscreenElement);

	// 有可能浏览器通过其它方式控制全屏功能
	const change = () => setFS(!document.fullscreenElement);
	onMount(() => {
		document.addEventListener('fullscreenchange', change);
	});
	onCleanup(() => {
		document.removeEventListener('fullscreenchange', change);
	});

	const toggle = async (v: boolean): Promise<boolean | undefined> => {
		if (!v) {
			if (!document.fullscreenElement) {
				await document.body.requestFullscreen();
			}
		} else {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			}
		}

		if (props.onToggle) {
			return await props.onToggle(v); // 如果是 onToggle 返回了值，需要如实返回，否则不返回值
		}

		return undefined;
	};

	return (
		<Root
			{...p}
			value={fs()}
			title={l.t('_c.fullscreen')}
			onToggle={toggle}
			on={<IconFullScreen />}
			off={<IconFullScreenExit />}
			ref={el => {
				if (props.ref) {
					props.ref(el);
				}
				el.root().ariaLabel = l.t('_c.fullscreen');
			}}
		/>
	);
}

export type FitScreenProps = Omit<Props, 'on' | 'off' | 'value' | 'title'> & {
	/**
	 * 指定需要扩展的容器
	 */
	container: HTMLElement;
};

/**
 * 将指定的容器扩展至整个屏幕大小
 *
 * NOTE: 需要保证当前组件必须在 {@link FitScreenProps#container} 之内，否则可能会无法退回原来状态的可能。
 */
export function FitScreen(props: FitScreenProps): JSX.Element {
	const l = useLocale();
	const [_, btnProps] = splitProps(props, ['container', 'ref']);

	const toggle = async (v: boolean): Promise<boolean | undefined> => {
		v = props.container.classList.toggle(styles['fit-screen']);

		if (props.onToggle) {
			const vv = await props.onToggle(v);
			if (vv === undefined) {
				return;
			}
			v = vv;
		}
		return v;
	};

	return (
		<Root
			{...btnProps}
			title={l.t('_c.fitscreen')}
			onToggle={toggle}
			on={<IconCollapse />}
			off={<IconExpand />}
			ref={el => {
				if (props.ref) {
					props.ref(el);
				}

				el.root().ariaLabel = l.t('_c.fitscreen');
			}}
		/>
	);
}
