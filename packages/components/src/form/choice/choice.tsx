// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { AvailableEnumType, cloneElement, joinClass } from '@components/base';
import type { Accessor, FieldBaseProps } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import { Dropdown, DropdownRef, MenuItem, MenuItemItem } from '@components/menu';
import styles from './style.module.css';

/**
 * 单个选择项的类型
 *
 * @remarks 直接采用了与 {@link MenuItem} 相同的类型，但是对为 type 为 a 的项是忽略处理的。
 */
export type Option<T extends AvailableEnumType = string> = MenuItem<T>;

interface Base<T extends AvailableEnumType = string> extends FieldBaseProps {
	placeholder?: string;

	/**
	 * 选择项
	 *
	 * @reactive
	 */
	options: Array<Option<T>>;

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

interface MProps<T extends AvailableEnumType = string> extends Base<T> {
	/**
	 * 是否多选
	 */
	multiple: true;

	accessor: Accessor<Array<T> | undefined>;
}

interface SProps<T extends AvailableEnumType = string> extends Base<T> {
	/**
	 * 是否多选
	 */
	multiple?: false;

	accessor: Accessor<T | undefined>;
}

export type Props<T extends AvailableEnumType = string> = MProps<T> | SProps<T>;

/**
 * 用以替代 select 组件
 */
export function Choice<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	const form = useForm();
	props = mergeProps(form, props);
	const id = createUniqueId();

	const getSelectedMenuItems = (vals: Array<T>): Array<MenuItemItem<T>> => {
		const items: Array<MenuItemItem<T>> = [];
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

	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));

	const value = createMemo(() => {
		// 生成下拉菜单的选中项
		const v = props.accessor.getValue();
		return v !== undefined ? (Array.isArray(v) ? v : [v]) : undefined;
	});

	const trigger = (
		<div class={joinClass(undefined, styles['activator-container'], props.rounded ? styles.rounded : '')}>
			<input
				id={id}
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
													if (props.disabled || props.readonly) {
														return;
													}

													if (props.multiple) {
														const v = props.accessor.getValue() as Array<T>;
														const vals = v.filter(vv => vv !== item.value);
														props.accessor.setValue(vals);
													} else {
														props.accessor.setValue(undefined);
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

	const onchange = props.multiple
		? (v: Array<T>) => {
				if (props.disabled || props.readonly) {
					return;
				}
				props.accessor.setValue(v);
			}
		: (v: T | undefined) => {
				if (props.disabled || props.readonly) {
					return;
				}
				props.accessor.setValue(v);
			};

	let dropdownRef: DropdownRef;
	return (
		<Field
			class={joinClass(undefined, styles.activator, props.class)}
			style={props.style}
			title={props.title}
			palette={props.palette}
		>
			<Show when={areas().labelArea}>
				{area => (
					<label
						style={{
							...fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
						}}
						for={id}
					>
						{props.label}
					</label>
				)}
			</Show>

			<div style={fieldArea2Style(areas().inputArea)} tabIndex={props.tabindex}>
				<Dropdown
					multiple={props.multiple}
					// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
					value={(props.accessor as Props<T>['accessor']).getValue() as any}
					// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
					onChange={onchange as any}
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
				</Dropdown>
			</div>

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}

/**
 * 遍历整个 opts 的的内容并在每一个非 a 项上调用 f 函数
 *
 * @param f - 遍历函数，如果返回 true 则停止遍历；
 * @param opts - 遍历对象；
 */
function walk<T extends AvailableEnumType = string>(
	f: (val: MenuItemItem<T>) => boolean | undefined,
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
