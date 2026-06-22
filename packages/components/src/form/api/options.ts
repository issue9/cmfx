// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable, Problem, Return, Validator } from '@cmfx/core';

import type { ProblemHandler } from '@components/base';

/**
 * 初始化 API 的参数
 *
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam PE - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export interface Options<T extends Flattenable, R = unknown, PE = never> {
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
	 * 在 {@link API} 中使用需要手动使用 {@link Validator#changeLocale} 更改语言，
	 * 在 {@link Form} 中则会自动调用 {@link Validator#changeLocale} 更改语言。
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
	 * 如果为空那么 {@link API#submit} 和 {@link API#spinning} 将无实际作用
	 */
	readonly submit?: (obj: T) => Promise<Return<R, PE>>;

	/**
	 * 加载表单数据
	 *
	 * @remarks
	 * 如果为空，{@link API#load} 将无实际用处。
	 * 加载的数据将作为 {@link API} 的默认数据；
	 */
	readonly load?: () => Promise<Return<T, PE>>;
}
