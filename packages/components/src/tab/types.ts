// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps } from 'solid-js';

import { BaseProps, ChangeFunc, Layout, RefProps } from '@components/base';

export interface Ref {
	/**
	 * 获取组件根元素
	 */
	root(): HTMLDivElement;

	/**
	 * 切换到指定的标签
	 */
	switch(id: Item['id']): void;

	/**
	 * 滚动标签列表
	 *
	 * @param delta - 滚动的距离，正数向右滚动，负数向左滚动。
	 */
	scroll(delta: number): void;
}

export interface Item {
	/**
	 * 该 Tab 的唯一 ID
	 */
	id: string;

	/**
	 * Tab 标签上的内容
	 */
	label?: JSX.Element;

	/**
	 * 该标签处于禁用状态
	 */
	disabled?: boolean;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 所有的 tab 项
	 *
	 * @reactive
	 */
	items: Array<Item>;

	/**
	 * 布局
	 *
	 * @defaultValue 'horizontal'
	 */
	layout?: Layout;

	/**
	 * 默认选中的值，如果为空，则选中第一个项。
	 *
	 * @reactive
	 */
	value?: Item['id'];

	/**
	 * 应用在标签面板上的样式
	 *
	 * @reactive
	 */
	panelClass?: string;

	/**
	 * 标签切换时的回调函数
	 */
	onChange?: ChangeFunc<Item['id']>;
}
