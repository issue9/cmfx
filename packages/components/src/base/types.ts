// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 定义了可用于使用的枚举值类型，要求唯一且可比较。
 */
export type AvailableEnumType = string | number;

export const layouts = ['horizontal', 'vertical'] as const;

/**
 * 组件布局方向
 */
export type Layout = (typeof layouts)[number];

/**
 * 修改数据时触发的事件
 *
 * @param val - 新的值；
 * @param old - 旧的值；
 * @typeParam T - 值的类型；
 */
export type ChangeFunc<T> = (val: T, old?: T) => void;

/**
 * 用于指定组件的 ref 属性
 *
 * @typeParam REF - Ref 对象类型；
 */
export interface RefProps<REF> {
	/**
	 * 对当前组件的一些次要操作可能会通过此方法给出
	 */
	ref?: (m: REF) => void;
}

/**
 * 为 Portal 组件指定的挂载属性
 */
export interface MountProps {
	/**
	 * 为 Portal 指定挂载位置
	 */
	mount?: Node;
}

/**
 * 所有组件的 ref 属性传递的参数类型
 */
export interface Ref<T> {
	/**
	 * 返回组件的根元素
	 */
	root(): T;
}

/**
 * 需要与外部作数据交换的组件可以从此接口继承属性
 *
 * @typeParam T - 表单项的值类型；
 */
export interface ValueProps<T> {
	/**
	 * 传递给组件的值
	 *
	 * @reactive
	 *
	 * @remarks
	 * 在 Form 之内，此属性不是可响应的，其值由 Form.Field 的 name 指定。
	 */
	value?: T;

	/**
	 * {@link value} 变化时的回调方法
	 */
	onChange?: ChangeFunc<T | undefined>;
}
