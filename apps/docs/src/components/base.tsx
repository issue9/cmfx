// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Checkbox, Choice, Form, InputNumber, type Layout, layouts, useLocale } from '@cmfx/components';
import type { DictKeys, PopoverPosition } from '@cmfx/core';
import { type Palette, palettes } from '@cmfx/themes';
import { type Accessor, type Component, createSignal, type JSX, type Setter } from 'solid-js';

import type messages from '@docs/messages/en.lang';
import type { StageProps, StagesProps } from './stages';

export function posSelector(preset?: PopoverPosition) {
	return arraySelector('_d.demo.tooltipPos', ['left', 'right', 'top', 'bottom'], preset ?? 'left');
}

export function labelAlignSelector(preset: Form.LabelAlignment) {
	return arraySelector('_d.demo.labelAlign', Form.labelAlignments, preset);
}

/**
 * 组件的分类
 */
export type Kind =
	| 'general'
	| 'layout'
	| 'navigation'
	| 'data-input'
	| 'data-display'
	| 'feedback'
	| 'config'
	| 'function';

/**
 * 表示演示组件的信息
 */
export type Info = {
	kind: Kind; // 组件分类
	title: DictKeys<typeof messages>; // 演示组件的标题，同时也是页面的标题。
	icon?: Component; // 演示组件的图标，需要多处使用，所以使用函数。如果为空会有默认图标。
	path: string; // 相对于 components/demo 的路径，同时作为文件路径和导航的路由路径。

	stages?: Array<StageProps>; // 演示内容
	api?: StagesProps['api']; // 关联的接口文档
	doc: StagesProps['doc'];
};

export function numeric<T extends number = number>(
	label: string,
	preset: T,
	min?: number,
	max?: number,
	step?: number,
): [Component, Accessor<T | undefined>, Setter<T | undefined>] {
	const [get, set] = createSignal<T | undefined>(preset);

	const num = (): JSX.Element => {
		const l = useLocale();
		return (
			<Form.Field label={l.t(label)}>
				<InputNumber class="w-20" min={min} max={max} step={step} value={get()} onChange={set} />
			</Form.Field>
		);
	};
	return [num, get, set];
}

/**
 * 创建一个 bool 选择项
 *
 * @param label - 标题的翻译 ID；
 * @param preset - 默认值；
 */
export function boolSelector(label: string, preset: boolean = false): [Component, Accessor<boolean>, Setter<boolean>] {
	const [get, set] = createSignal(preset);
	const chk = () => {
		const l = useLocale();
		return <Checkbox checked={get()} onChange={v => set(!!v)} label={l.t(label)} />;
	};
	return [chk, get, set];
}

/**
 * 创建色盘选择工具
 * @param preset - 默认值
 */
export function paletteSelector(preset?: Palette) {
	return arraySelector('_d.demo.palette', palettes, preset);
}

export function layoutSelector(label: string, preset?: Layout) {
	return arraySelector(label, layouts, preset);
}

export function buttonKindSelector(v?: Button.Kind) {
	return arraySelector('_d.demo.buttonKind', Button.kinds, v);
}

/**
 * 将数组或是 Map 生成下拉的单选项
 *
 * @param label - 标题的翻译 ID；
 * @param array - 数组或是 Map，如果是数组，数组的元素值将作为选项值和选项名称展示，如果是 map，键名为选项值，键值为选项名称；
 * @param preset - 默认值；
 * @param appendUndefined - 是否添加 undefined 选项；
 */
export function arraySelector<T extends string | number>(
	label: string,
	array: ReadonlyArray<T> | ReadonlyMap<T, string>,
	preset?: T,
	appendUndefined = false,
): [Component, Accessor<T | undefined>, Setter<T | undefined>] {
	const signal = createSignal<T | undefined>(preset);

	let options: Array<Choice.Option<T>>;

	if (Array.isArray(array)) {
		options = array.map(item => {
			return {
				type: 'item',
				value: item,
				label: item,
			};
		});
	} else {
		const m = array as ReadonlyMap<T, string>;
		options = Array.from(m.entries()).map(([key, val]) => {
			return {
				type: 'item',
				value: key,
				label: val,
			};
		});
	}

	if (appendUndefined) {
		options.push({
			type: 'item',
			value: undefined,
			label: 'undefined',
		});
	}

	const elem = () => {
		const l = useLocale();
		return (
			<Choice
				closable
				placeholder={l.t(label)}
				value={signal[0]()}
				options={options}
				onChange={v => signal[1](() => v)}
			/>
		);
	};

	return [elem, signal[0], signal[1]];
}

/**
 * 可多选的下拉框
 */
export function arrayMultipleSelector<T extends string | number>(
	label: string,
	array: ReadonlyArray<T> | ReadonlyMap<T, string>,
	preset?: Array<T>,
	appendUndefined = false,
): [Component, Accessor<Array<T> | undefined>, Setter<Array<T> | undefined>] {
	const signal = createSignal<Array<T> | undefined>(preset);

	let options: Array<Choice.Option<T>>;

	if (Array.isArray(array)) {
		options = array.map(item => {
			return {
				type: 'item',
				value: item,
				label: item,
			};
		});
	} else {
		const m = array as ReadonlyMap<T, string>;
		options = Array.from(m.entries()).map(([key, val]) => {
			return {
				type: 'item',
				value: key,
				label: val,
			};
		});
	}

	if (appendUndefined) {
		options.push({
			type: 'item',
			value: undefined,
			label: 'undefined',
		});
	}

	const elem = () => {
		const l = useLocale();
		return (
			<Choice
				closable
				multiple
				placeholder={l.t(label)}
				value={signal[0]()}
				onChange={v => signal[1](v)}
				options={options}
			/>
		);
	};

	return [elem, signal[0], signal[1]];
}
