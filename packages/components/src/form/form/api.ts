// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable, FlattenKeys, Params, Problem, Return, Validator } from '@cmfx/core';
import { createSignal, Signal } from 'solid-js';

import { ObjectAccessor } from './access';

/**
 * 初始 {@link FormAPI} 的参数
 */
export interface Options<T extends Flattenable, R = never, PE = never> {
    /**
     * 初始值
     */
    readonly value: T;

    /**
     * 在服务端返回未处理的 {@link Problem} 对象时的处理方法
     *
     * @remarks
     * FormAPI 本身会自动处理状态码为 400 的错误。onProblem 只需要处理其它情况即可。
     */
    readonly onProblem?: { (p: Problem<PE>): Promise<void> };

    /**
     * 在接口正常返回时调用的方法
     */
    readonly onSuccess?: { (r?: Return<R, never>): void; };

    /**
     * 提交前对数据的验证方法；
     *
     * @remarks
     * 如果需要验证器输出的错误信息保持与当前环境相同的本地化语言，
     * 在 {@link FormAPI} 中使用需要手动使用 {@link Validator#changeLocale} 更新语言，
     * 在 {@link createForm} 中则会自动调用 {@link Validator#changeLocale} 更新语言。
     */
    readonly validator?: Validator<T>;

    /**
     * 是否在单个数据变更时即验证该条数据
     */
    readonly validOnChange?: boolean;

    /**
     * 提交数据的方法，如果为空那么 {@link FormAPI#submit} 和 {@link FormAPI#submitting} 将无实际作用
     */
    readonly submit?: { (obj: T): Promise<Return<R, PE>>; };
}

/**
 * 用于操作表单的 API
 *
 * @remarks
 * 相对于 {@link ObjectAccessor}，当前对象提供了一些额外的接口用于以方便与表单进行配合操作。
 *
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam P - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export class FormAPI<T extends Flattenable, R = never, P = never> extends ObjectAccessor<T> {
    readonly #onProblem?: Options<T, R, P>['onProblem'];
    readonly #submit?: Options<T, R, P>['submit'];
    readonly #onSuccess?: Options<T, R, P>['onSuccess'];
    readonly #submitting: Signal<boolean>;

    constructor(options: Options<T, R, P>) {
        super(options.value, options.validator, options.validOnChange);
        this.#onProblem = options.onProblem;
        this.#submit = options.submit;
        this.#onSuccess = options.onSuccess;
        this.#submitting = createSignal<boolean>(false);
    }

    /**
     * 指示是否处于提交状态
     *
     * @remarks
     * 如果当前表单未在构造函数中指定 {@link Options#submit} 参数，则始终返回 false。
     */
    submitting() { return this.#submitting[0](); }

    /**
     * 提交数据
     *
     * @returns 表示接口是否成功调用，如果当前表单未在构造函数中指定 {@link Options#submit} 参数，则始终返回 false。
     */
    async submit(): Promise<boolean> {
        if (!this.#submit) { return false; }

        this.setError(); // 取消上次的错误提示

        this.#submitting[1](true);
        try {
            const obj = await this.object();
            if (!obj) { return false; }

            const ret = await this.#submit(obj);
            if (ret.ok) {
                if (this.#onSuccess) { this.#onSuccess(ret); }
                return true;
            }

            if (!ret.body) { return true; }

            if (ret.status === 400) {
                if (ret.body.params) {
                    this.setError(ret.body.params as Params<FlattenKeys<T>>);
                } else {
                    this.setError(ret.body.title);
                }

                return false;
            }

            if (this.#onProblem) { await this.#onProblem(ret.body); }

            return false;
        } finally {
            this.#submitting[1](false);
        }
    }
}
