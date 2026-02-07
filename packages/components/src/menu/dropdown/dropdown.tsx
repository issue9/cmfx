// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Hotkey, PopoverAlign, pointInElement } from '@cmfx/core';
import { createSignal, JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';

import { AvailableEnumType, joinClass, RefProps } from '@components/base';
import { Menu, type MenuProps, MenuRef } from '@components/menu/menu';
import styles from './style.module.css';

export interface Ref {
	/**
	 * 显示下拉的菜单
	 */
	show(): void;

	/**
	 * 隐藏下拉的菜单
	 */
	hide(): void;

	/**
	 * 切换菜单的显示和关闭
	 */
	toggle(): void;

	/**
	 * 组件的根元素
	 */
	root(): HTMLDivElement;

	/**
	 * 下拉菜单的元素
	 */
	menu(): MenuRef;
}

interface Base extends ParentProps, RefProps<Ref> {
	/**
	 * 触发方式
	 *
	 * @defaultValue 'click'
	 * @remarks
	 * 下拉菜单的打开的方式，可以是以下值：
	 *  - click 鼠标点击；
	 *  - hover 鼠标悬停，*移动端不支持*；
	 *  - contextmenu 右键菜单；
	 *  - custom 自定义，可通过 {@link Ref} 控制；
	 */
	trigger?: 'click' | 'hover' | 'contextmenu' | 'custom';

	/**
	 * 下拉菜单弹出时的回调函数
	 *
	 * @remarks 下拉菜单弹出时的回调函数，其原型为 `(visible: boolean): boolean`，
	 * visible 参数表示当前是否为可见状态，返回值为 `true` 时，将阻止下拉菜单的弹出。
	 */
	onPopover?: (visible: boolean) => boolean | undefined;

	/**
	 * 快捷键
	 */
	hotkey?: Hotkey;

	/**
	 * 菜单展开的对齐方式
	 *
	 * @defaultValue 'end'
	 * @reactive
	 */
	align?: PopoverAlign;
}

interface MProps<T extends AvailableEnumType = string>
	extends Omit<Extract<MenuProps<T>, { multiple: true }>, 'layout' | 'tag' | 'ref'>,
		Base {}

interface SProps<T extends AvailableEnumType = string>
	extends Omit<Extract<MenuProps<T>, { multiple?: false }>, 'layout' | 'tag' | 'ref'>,
		Base {}

export type Props<T extends AvailableEnumType = string> = SProps<T> | MProps<T>;

const presetProps = {
	align: 'end',
	trigger: 'click',
} as const;

/**
 * 下拉菜单
 *
 * @typeParam T - 选项类型；
 */
export default function Dropdown<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	props = mergeProps(presetProps, props);
	const [_, menuProps] = splitProps(props, [
		'trigger',
		'children',
		'ref',
		'class',
		'style',
		'align',
		'hotkey',
		'onChange',
	]);

	const [triggerRef, setTriggerRef] = createSignal<HTMLDivElement>();
	let menuRef: MenuRef;
	let rootRef: HTMLDivElement;
	let isOpen = false;
	const isManual = props.trigger === 'contextmenu' || props.trigger === 'custom';

	const show = (): void => {
		if (isOpen) {
			return;
		}

		menuRef.root().showPopover();
		const anchor = triggerRef()!.getBoundingClientRect();
		adjustPopoverPosition(menuRef.root(), anchor, 0, 'bottom', props.align);
	};

	const hide = (): void => {
		if (!isOpen) {
			return;
		}
		menuRef.root().hidePopover();
	};

	const toggle = (): void => {
		isOpen ? hide() : show();
	};

	// popover === manual 模式下，需要手动处理按钮
	if (isManual) {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				hide();
			}
		};

		onMount(() => {
			document.addEventListener('keydown', handleEsc);
		});
		onCleanup(() => {
			document.removeEventListener('keydown', handleEsc);
		});
	}

	// 右键菜单为手动模式，需要处理鼠标点击在菜单之外的情况。
	// 但是 custom 模式下，不需要处理鼠标点击在菜单之外的情况，
	// 否则将 show 绑定在菜单之外的按钮，会导致菜单始终无法打开。
	if (props.trigger === 'contextmenu') {
		const click = (e: MouseEvent) => {
			if (!menuRef.root().contains(e.target as HTMLElement)) {
				hide();
			}
		};

		onMount(() => {
			document.addEventListener('click', click);
		});
		onCleanup(() => {
			document.removeEventListener('click', click);
		});
	}

	if (props.hotkey) {
		onMount(() => {
			Hotkey.bind(props.hotkey!, toggle);
		});
		onCleanup(() => {
			Hotkey.unbind(props.hotkey!);
		});
	}

	const onChange = props.multiple
		? props.onChange
		: (v: T, old?: T) => {
				if (props.onChange) {
					props.onChange(v, old);
				}
				hide();
			};

	return (
		<div
			class={joinClass(props.palette, props.class)}
			style={props.style}
			ref={el => {
				rootRef = el;
			}}
		>
			<div
				aria-haspopup
				ref={el => setTriggerRef(el)}
				onmouseenter={() => {
					if (props.trigger !== 'hover' || !menuRef) {
						return;
					}
					show();
				}}
				onmouseleave={e => {
					if (props.trigger !== 'hover' || !menuRef) {
						return;
					}

					if (!pointInElement(e.clientX, e.clientY, menuRef.root())) {
						hide();
					}
				}}
				oncontextmenu={e => {
					if (props.trigger !== 'contextmenu' || !menuRef) {
						return;
					}

					e.preventDefault();
					show();
					adjustPopoverPosition(menuRef.root(), new DOMRect(e.clientX, e.clientY, 1, 1));
				}}
				onclick={e => {
					if (props.trigger !== 'click' || !menuRef) {
						return;
					}

					e.preventDefault();
					e.stopPropagation();
					show();
				}}
			>
				{props.children}
			</div>
			<Menu
				// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
				onChange={onChange as any}
				{...menuProps}
				layout="vertical"
				tag="menu"
				class={joinClass(undefined, styles.dropdown)}
				ref={(el: MenuRef) => {
					el.root().tabIndex = -1;
					el.root().popover = isManual ? 'manual' : 'auto';
					menuRef = el;

					el.root().onmouseleave = e => {
						if (props.trigger !== 'hover') {
							return;
						}
						if (!pointInElement(e.clientX, e.clientY, triggerRef()!)) {
							hide();
						}
					};

					el.root().onbeforetoggle = (e: ToggleEvent) => {
						isOpen = e.newState === 'open';
						if (props.onPopover?.(isOpen)) {
							isOpen = false;
							e.preventDefault();
						}
					};

					if (props.ref) {
						props.ref({
							show: show,
							hide: hide,
							toggle: toggle,
							root: () => rootRef,
							menu: () => el,
						});
					}
				}}
			/>
		</div>
	);
}
