// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import {
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	Match,
	mergeProps,
	onCleanup,
	onMount,
	Show,
	Switch,
} from 'solid-js';

import { type BaseProps, type RefProps, style2String } from '@components/base';
import { Form } from '@components/form/form';
import { Input } from '@components/input';
import { Dropdown, type Menu } from '@components/menu';
import { calcLayoutFieldAreas } from './area.ts';
import styles from './style.module.css';

export type Ref = Input.RootRef;

export interface Props extends Form.FieldBaseProps, RefProps<Ref> {
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
	 * 文本框内顶部的内容
	 *
	 * @reactive
	 */
	prefix?: JSX.Element;

	/**
	 * 文本框内尾部的内容
	 *
	 * @reactive
	 */
	suffix?: JSX.Element;

	/**
	 * placeholder
	 *
	 * @reactive
	 */
	placeholder?: string;

	/**
	 * 内容类型
	 *
	 * @remarks
	 * 只有在此值为 number 时，内容才会被当作数值处理。
	 *
	 * @reactive
	 */
	type?: Input.TextProps['type'];

	/**
	 * NOTE: 非响应式属性
	 */
	accessor: Form.Accessor<string | undefined>;

	/**
	 * 键盘的输入模式
	 *
	 * @reactive
	 */
	inputMode?: Input.TextProps['inputMode'];

	/**
	 * autocomplete
	 *
	 * @reactive
	 */
	autocomplete?: Input.AutoComplete;

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
	 * 显示位置会因为其它变量的不同而有所变化，如果 {@link hasHelp} 为 true，
	 * 那么统计内容始终显示在提示信息的尾部，否则会根据 {@link layout} 的不同有所变化，
	 * 当 layout === 'horizontal' 时，统计内容显示在标题的右侧，否则显示在整个组件的右侧。
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
	onSearch?: (text?: string) => Array<string>;
}

function countFormater(val: number, max?: number): string {
	return max !== undefined ? `${val}/${max}` : val.toString();
}

/**
 * 提供了单行的输入组件
 *
 * @typeParam T - 文本框内容的类型
 */
export function Root(props: Props): JSX.Element {
	const form = Form.useForm();
	props = mergeProps(form, props);

	const id = createUniqueId();
	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label, !!props.count));
	const [candidate, setCandidate] = createSignal<Array<Menu.MenuItem>>([]);

	const [count, setCount] = createSignal('');
	createEffect(() => {
		if (props.count) {
			const formatter = props.count === true ? countFormater : props.count;
			setCount(formatter(props.accessor.getValue()?.toString().length ?? 0, props.maxLength));
		} else {
			setCount('');
		}
	});

	let dropdownRef: Dropdown.RootRef;
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

	const Trigger = (p: { style?: BaseProps['style'] }) => {
		let inputRef: Input.RootRef;
		createEffect(() => {
			inputRef.root().style = style2String(p.style);
		});

		return (
			<Input.Root
				id={id}
				prefix={props.prefix}
				suffix={props.suffix}
				rounded={props.rounded}
				inputMode={props.inputMode}
				autocomplete={props.autocomplete}
				tabindex={props.tabindex}
				disabled={props.disabled}
				readonly={props.readonly}
				placeholder={props.placeholder}
				value={props.accessor.getValue()}
				onChange={v => {
					props.accessor.setValue(v);
					props.accessor.setError();

					if (props.onSearch) {
						setCandidate(props.onSearch(v).map(item => ({ type: 'item', value: item, label: item })));
						dropdownRef.show();
					}
				}}
				ref={el => {
					inputRef = el;
					if (props.ref) {
						props.ref({
							root: () => rootRef,
							input: () => el.input(),
						});
					}
				}}
			/>
		);
	};

	return (
		<Form.Field
			title={props.title}
			ref={el => (rootRef = el)}
			palette={props.palette}
			class={props.class}
			style={props.style}
		>
			<Show when={areas().labelArea}>
				{area => (
					<label
						style={{
							...Form.fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
						}}
						for={id}
					>
						{props.label}
					</label>
				)}
			</Show>

			<Switch fallback={<Trigger style={Form.fieldArea2Style(areas().inputArea)} />}>
				<Match when={props.onSearch}>
					<div style={Form.fieldArea2Style(areas().inputArea)} class="w-full">
						<Dropdown.Root
							trigger="custom"
							items={candidate()}
							ref={el => {
								dropdownRef = el;
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
							onChange={e => {
								props.accessor.setValue(e);
							}}
						>
							<Trigger />
						</Dropdown.Root>
					</div>
				</Match>
			</Switch>

			<Show when={areas().helpArea}>
				{area => <Form.FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>

			<Show when={areas().countArea}>
				{area => (
					<div class={styles.count} style={Form.fieldArea2Style(area())}>
						{count()}
					</div>
				)}
			</Show>
		</Form.Field>
	);
}
