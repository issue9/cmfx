// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, type JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import type { AvailableEnumType, BaseProps, BaseRef, RefProps, ValueProps } from '@components/base';
import { joinClass, style2String } from '@components/base';
import { Form } from '@components/form';
import { Dropdown, type Menu } from '@components/menu';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

/**
 * 单个选择项的类型
 *
 * @remarks
 * 直接采用了与 {@link MenuItem} 相同的类型，但是对为 type 为 a 的项是忽略处理的。
 */
export type Option<T extends AvailableEnumType = string> = Menu.MenuItem<T>;

export type Options<T extends AvailableEnumType = string> = Array<Option<T>>;

interface Base<T extends AvailableEnumType = string> extends BaseProps, RefProps<Ref> {
	placeholder?: string;

	/**
	 * 选择项
	 *
	 * @reactive
	 */
	options: Options<T>;

	/**
	 * 选项是否可关闭
	 *
	 * @remarks
	 * 如果为 true，表示可以通过每个选中项后的关闭按钮取消当前选中项，
	 * 如果是单选，那么可以让整个选项处于没有选中项的状态。
	 *
	 * @reactive
	 */
	closable?: boolean;
}

export interface MultipleProps<T extends AvailableEnumType = string>
	extends Form.DataProps,
		ValueProps<Array<T>>,
		Base<T> {
	/**
	 * 是否多选
	 */
	multiple: true;
}

export interface SingleProps<T extends AvailableEnumType = string> extends Form.DataProps, ValueProps<T>, Base<T> {
	/**
	 * 是否多选
	 */
	multiple?: false;
}

export type Props<T extends AvailableEnumType = string> = MultipleProps<T> | SingleProps<T>;

/**
 * 用以替代 select 组件
 */
export function Root<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
	const field = Form.useField(props as any, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const getSelectedMenuItems = (vals: Array<T>): Array<Menu.Item<T>> => {
		const items: Array<Menu.Item<T>> = [];
		if (props.multiple) {
			walk(i => {
				if (vals.includes(i.value!)) {
					items.push(i);
				}
				return undefined;
			}, props.options);
		} else {
			walk(i => {
				if (i.value === vals[0]) {
					items.push(i);
					return true; // 单选，找到值即可返回
				}
			}, props.options);
		}
		return items;
	};

	// 生成下拉菜单的选中项
	const value = createMemo(() => {
		const v = field.getValue();
		return v !== undefined ? (Array.isArray(v) ? v : [v]) : undefined;
	});

	const trigger = (
		<div
			class={joinClass(props.palette, props.class, field.class, styles.activator, props.rounded ? styles.rounded : '')}
			style={style2String(field.style, props.style)}
		>
			<input
				id={field.id()}
				tabIndex={props.tabindex}
				class="peer hidden"
				disabled={props.disabled}
				readOnly={props.readonly}
			/>
			<div class={styles.input}>
				<Switch fallback={<span class={styles.placeholder} innerHTML={props.placeholder ?? '&#160;'} />}>
					<Match when={value() && value()!.length > 0 ? value() : undefined}>
						{val => (
							<For each={getSelectedMenuItems(val())}>
								{item => (
									<span class={styles.chip}>
										{cloneElement(item.label)}
										<Show when={props.closable}>
											<IconClose
												class={styles.close}
												onclick={(e: MouseEvent) => {
													if (props.readonly) {
														return;
													}

													if (props.multiple) {
														const v = field.getValue() as Array<T>;
														const vals = v.filter(vv => vv !== item.value);
														field.setValue(vals);
													} else {
														field.setValue(undefined);
													}
													e.stopPropagation();
													e.preventDefault();
												}}
											/>
										</Show>
									</span>
								)}
							</For>
						)}
					</Match>
				</Switch>
			</div>
			<IconExpandAll class={styles.expand} />
		</div>
	);

	let dropdownRef: Dropdown.RootRef;
	return (
		<Dropdown.Root
			multiple={props.multiple}
			// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
			value={field.getValue() as any}
			// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
			onChange={v => field.setValue(v as any)}
			items={props.options}
			ref={el => {
				const s = el.menu().root().style;
				s.maxHeight = '240px';
				s.overflowY = 'auto';

				dropdownRef = el;
			}}
			onPopover={e => {
				if (props.disabled) {
					return true;
				} // disabled 模式下不弹出菜单

				if (e) {
					dropdownRef.menu().scrollSelectedIntoView();
				}
				return false;
			}}
		>
			{trigger}
		</Dropdown.Root>
	);
}

/**
 * 遍历整个 opts 的的内容并在每一个非 a 项上调用 f 函数
 *
 * @param f - 遍历函数，如果返回 true 则停止遍历；
 * @param opts - 遍历对象；
 */
function walk<T extends AvailableEnumType = string>(
	f: (val: Menu.Item<T>) => boolean | undefined,
	opts?: Array<Option<T>>,
) {
	if (!opts || opts.length === 0) {
		return;
	}

	for (const o of opts) {
		switch (o.type) {
			case 'group':
				walk<T>(f, o.items);
				break;
			case 'item':
				if (o.items && o.items.length > 0) {
					walk<T>(f, o.items);
				} else {
					if (f(o)) {
						return;
					}
				}
				break;
			// NOTE: 自动忽略 a
		}
	}
}

/**
 * 复制整个 {@link JSX#Element} 元素
 *
 * NOTE: 仅复制元素，但是对于通过 addEventListener 等方式绑定的事件处理函数，不会被复制。
 */
function cloneElement(e: JSX.Element): JSX.Element {
	if (e instanceof Node) {
		return e.cloneNode(true);
	} else if (Array.isArray(e)) {
		return e.map(e => cloneElement(e));
	} else {
		// 其它的均为普通类型，直接返回。
		return e;
	}
}
