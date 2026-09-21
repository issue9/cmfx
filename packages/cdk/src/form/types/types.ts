// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable, Problem, Return, Validator } from '@cmfx/core';
import type { JSX } from 'solid-js';

import type { ChangeFunc, ProblemHandler } from '@cdk/base';

/**
 * 表单数据的几种状态
 */
export const formStates = ['enabled', 'disabled', 'readonly', 'loading', 'submitting'] as const;

export type FormState = (typeof formStates)[number];

/**
 * 定义了访问表单中某个字段的接口
 *
 * @typeParam T - 字段的值类型；
 */
export interface FormField<T> {
	/**
	 * 字段的唯一标识
	 */
	readonly id: string;

	/**
	 * 字段的名称
	 *
	 * @remarks
	 * 在某些场合下可能用到，比如可能会用在 radio group 中 input 的 name 属性。
	 */
	readonly name: string;

	/**
	 * 当前接口操作的值是否是某个表单中的值
	 */
	readonly inForm?: boolean;

	/**
	 * 当前字段的状态
	 */
	getState(): FormState;

	/**
	 * 设置当前字段的状态
	 */
	setState(v: FormState): void;

	/**
	 * 获取当前元素的错误信息，如果没有错误则返回 undefined
	 *
	 * @returns 返回的是由 {@link createStore} 创建的对象属性，是一个可响应的属性。
	 */
	getError(): string | undefined;

	/**
	 * 修改当前元素的错误信息
	 *
	 * @param err - 如果为 undefined，则表示清空错误信息。
	 */
	setError(err?: string): void;

	/**
	 * 区别当前元素关联的值
	 *
	 * @returns 返回的是由 {@link createStore} 创建的对象属性，是一个可响应的属性。
	 */
	getValue(): T | undefined;

	/**
	 * 修改当前元素关联的值
	 *
	 * @param val 新的值，如果与旧值相同，则不会实际执行修改操作，即不会触发 {@link onChange} 注册的事件；
	 * @param silent 如果为 true，不触发 {@link onChange} 注册的事件；
	 */
	setValue(val: T | undefined, silent?: boolean): void;

	/**
	 * 注册值变化时的回调函数
	 */
	onChange(f: ChangeFunc<T | undefined>): void;

	/**
	 * 重置为默认值
	 *
	 * @param silent 如果为 true，不触发 {@link onChange} 注册的事件；
	 */
	reset(silent?: boolean): void;

	/**
	 * 获取当前元素关联的扩展字段
	 *
	 * @remarks
	 * 这是一个可响应的值
	 */
	getExtra(): JSX.Element | undefined;

	/**
	 * 修改当前元素关联的扩展字段
	 */
	setExtra(extra: JSX.Element | undefined): void;
}

/**
 * 初始化 FormContext 的参数
 *
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam PE - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export interface FormContextOptions<T extends Flattenable, R = unknown, PE = never> {
	/**
	 * 初始值
	 *
	 * @remarks
	 * 该值仅作为数据表的初始默认值使用，一般情况下直接给定一个所有字段均为零值的对象即可。
	 * 如果 {@link load} 不为空，可能还需要调用该方法对数据表进行真正的初始化，比如从远程拉取数据。
	 */
	readonly initValue: T;

	/**
	 * 在服务端返回未处理的 {@link Problem} 对象时的处理方法
	 *
	 * @remarks
	 * 该方法仅在 {@link load} 和 {@link submit} 的调用过程中会调用。
	 * {@link submit} 会自动处理状态码为 400 的错误。onProblem 只需要处理其它情况即可。
	 */
	readonly onProblem?: ProblemHandler<PE>;

	/**
	 * 在接口正常返回时调用的方法
	 */
	readonly onSuccess?: (r?: Return<R, never>) => void;

	/**
	 * 提交前对数据的验证方法；
	 *
	 * @remarks
	 * 如果需要验证器输出的错误信息保持与当前环境相同的本地化语言，
	 * 在 {@link FormContext} 中使用需要手动使用 {@link Validator#changeLocale} 更改语言，
	 */
	readonly validator?: Validator<T>;

	/**
	 * 是否在单个数据变更时即验证该条数据
	 */
	readonly validOnChange?: boolean;

	/**
	 * 提交数据的方法
	 *
	 * @remarks
	 * 如果为空那么 {@link FormContext#submit} 将无实际作用
	 */
	readonly submit?: (obj: T) => Promise<Return<R, PE>>;

	/**
	 * 加载表单数据
	 *
	 * @remarks
	 * 如果为空，{@link FormContext#load} 将无实际用处。
	 * 加载的数据将作为 {@link FormContext} 的默认数据；
	 */
	readonly load?: () => Promise<Return<T, PE>>;
}
