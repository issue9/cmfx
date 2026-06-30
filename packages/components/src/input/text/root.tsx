// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import { createEffect, createSignal, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';

import { type BaseProps, joinClass, style2String } from '@components/base';
import { Form } from '@components/form';
import { InputBase } from '@components/input/base';
import { Dropdown, type Menu } from '@components/menu';

export type InputTextRef = InputBase.Ref;

export interface InputTextProps extends BaseProps, InputBase.TextProps {
	/**
	 * 最小的字符数量
	 *
	 * @reactive
	 */
	maxLength?: number;

	/**
	 * 最大的字符数量
	 *
	 * @reactive
	 */
	minLength?: number;

	/**
	 * autocomplete
	 *
	 * @reactive
	 */
	autocomplete?: InputBase.AutoComplete;

	/**
	 * 指定显示字符串统计的格式化方法
	 *
	 * @remarks
	 * 如果为方法，表示采用此方法格式化字符串统计内容并显示在恰当的位置，
	 * 如果为 true，相当于指定了类似以下方法作为格式化方法：
	 * ```ts
	 * (val, max?) => `${val}/${max}`
	 * ```
	 * 如果为 false 或是为空表示不需要展示统计数据。
	 *
	 * 内容会通过 {@link FiledAccessor#setExtra} 显示
	 *
	 * @reactive
	 */
	count?: boolean | ((val: number, max?: number) => string);

	/**
	 * 提供候选词列表
	 *
	 * @remarks
	 * 当前此属性不为空时，每次的输入都会触发此方法，并将其返回值作为候选列表展示。
	 */
	readonly onSearch?: (text?: string) => Array<string>;
}

function countFormatter(val: number, max?: number): string {
	return max !== undefined ? `${val}/${max}` : val.toString();
}

/**
 * 提供了单行的输入组件
 *
 * @typeParam T - 文本框内容的类型
 */
export function InputText(props: InputTextProps): JSX.Element {
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);
	const field = Form.useField<string>(props, true);

	if (props.onSearch) {
		field.onChange(v => {
			setCandidate(props.onSearch!(v).map(item => ({ type: 'item', value: item, label: item })));
			dropdownRef.show();
		});
	}

	const [candidate, setCandidate] = createSignal<Array<Menu.Item>>([]);

	createEffect(() => {
		if (props.count) {
			const formatter = props.count === true ? countFormatter : props.count;
			field.setExtra(formatter(field.getValue()?.toString().length ?? 0, props.maxLength));
		} else {
			field.setExtra('');
		}
	});

	let dropdownRef: Dropdown.Ref;
	let rootRef: HTMLDivElement;

	onMount(() => {
		if (dropdownRef) {
			const click = (e: MouseEvent) => {
				if (!dropdownRef.root().contains(e.target as HTMLElement)) {
					dropdownRef.hide();
				}
			};

			document.addEventListener('click', click);
			onCleanup(() => {
				document.removeEventListener('click', click);
			});
		}
	});

	const Trigger = (p: BaseProps): JSX.Element => {
		return (
			<InputBase
				{...p}
				id={field.id}
				prefix={props.prefix}
				suffix={props.suffix}
				rounded={props.rounded}
				inputMode={props.inputMode}
				autocomplete={props.autocomplete}
				tabindex={props.tabindex}
				disabled={props.disabled}
				readonly={props.readonly}
				placeholder={props.placeholder}
				value={field.getValue()}
				onChange={v => field.setValue(v)}
				ref={el => {
					if (props.ref) {
						props.ref({
							root: () => rootRef ?? el.root(),
							input: () => el.input(),
						});
					}
				}}
			/>
		);
	};

	return (
		<Switch
			fallback={
				<Trigger
					palette={props.palette}
					style={style2String(field.style, props.style)}
					class={joinClass(undefined, field.class, props.class)}
				/>
			}
		>
			<Match when={props.onSearch}>
				<Dropdown
					palette={props.palette}
					style={props.style}
					class={props.class}
					trigger="custom"
					items={candidate()}
					ref={el => {
						dropdownRef = el;
						rootRef = el.root();
						const style = dropdownRef.menu().root().style;
						style.height = '240px';
						style.overflowY = 'auto';
					}}
					onPopover={visible => {
						if (visible) {
							dropdownRef.menu().root().style.width = `${dropdownRef.root().getBoundingClientRect().width}px`;
						}
						return false;
					}}
					onChange={e => field.setValue(e)}
				>
					<Trigger />
				</Dropdown>
			</Match>
		</Switch>
	);
}
