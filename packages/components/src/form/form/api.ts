// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable, FlattenKeys, Problem, Return, Validator, Params } from '@cmfx/core';
import { createSignal, Signal } from 'solid-js';
import { Store } from 'solid-js/store';

import { Accessor } from '@/form/field';
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
     * 在服务端返回未处理的 {@link Problem} 对象时的处理方法，当前实现会自动处理带有 {@link Problem#params} 字段的错误
     */
    readonly onProblem?: { (p: Problem<PE>): Promise<void> };

    /**
     * 在接口正常返回时调用的方法；
     */
    readonly onSuccess?: { (r?: Return<R, never>): void; };

    /**
     * 提交前对数据的验证方法；
     */
    readonly validator?: Validator<T>;

    /**
     * 提交数据的方法，如果为空那么 {@link FormAPI#submit} 和 {@link FormAPI#submitting} 将无实际作用
     */
    readonly submit?: { (obj: T): Promise<Return<R, PE>>; };
}

/**
 * 用于操作表单的 API
 *
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam P - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export class FormAPI<T extends Flattenable, R = never, P = never> {
    readonly #object: ObjectAccessor<T>;
    readonly #validator?: Options<T, R, P>['validator'];
    readonly onProblem?: Options<T, R, P>['onProblem'];
    readonly #submit?: Options<T, R, P>['submit'];
    readonly onSuccess?: Options<T, R, P>['onSuccess'];

    readonly #submitting: Signal<boolean>;

    /**
     * 构造函数
     *
     * @param preset - 初始值；
     * @param submit - 提交数据的方法，如果为空那么 {@link FormAPI#submit} 和 {@link FormAPI#submitting} 将无实际作用；
     * @param onProblem - 处理服务端返回为 {@link Problem} 时的方法。如果服务端返回的是 400 且带有 params，会自动进行一次处理，
     *  如果 onProblem 不想再次处理，需要将其过滤；
     * @param onSuccess - 在接口正常返回时调用的方法；
     * @param v - 提交前对数据的验证方法；
     */
    constructor(options: Options<T, R, P>) {
        this.#object = new ObjectAccessor(options.value);
        this.#validator = options.validator;
        this.onProblem = options.onProblem;
        this.#submit = options.submit;
        this.onSuccess = options.onSuccess;
        this.#submitting = createSignal<boolean>(false);
    }

    /**
     * 指示是否处于提交状态
     *
     * @remarks
     * 如果当前表单未在构造函数中指定 req 参数，则始终返回 false。
     */
    submitting() { return this.#submitting[0](); }

    /**
     * 返回某个字段的 {@link Accessor} 接口供表单元素使用
     *
     * @remarks
     * 即使指定的字段当前还不存在于当前对象，依然会返回一个 {@link Accessor} 接口，
     * 后续的 {@link Accessor#setValue} 会自动向当前对象添加该值。
     */
    accessor<FT = unknown, K extends string = string>(name: FlattenKeys<T>, kind?: K): Accessor<FT, K> {
        return this.#object.accessor<FT, K>(name, kind);
    }

    setPreset(v: T) { return this.#object.setPreset(v); }

    setValue(v: T) { return this.#object.setValue(v); }

    getValue(): Store<T> { return this.#object.getValue(); }

    /**
     * 将错误信息设置到指定的字段上
     *
     * @param errs - 错误列表，为空表示取消所有的错误显示；
     */
    setError(errs?: Params<FlattenKeys<T>>) { this.#object.setError(errs); }

    /**
     * 当前内容是否都是默认值
     */
    isPreset() { return this.#object.isPreset(); }

    /**
     * 提交数据
     *
     * @returns 表示接口是否成功调用，如果当前表单未在构造函数中指定 req 参数，则始终返回 false。
     */
    async submit(): Promise<boolean> {
        if (!this.#submit) { return false; }

        this.#submitting[1](true);
        try {
            const obj = await this.object();
            if (!obj) { return false; }

            const ret = await this.#submit(obj);
            if (ret.ok) {
                if (this.onSuccess) { this.onSuccess(ret); }
                return true;
            }

            if (!ret.body) { return true; }

            if (ret.body.params) { this.#object.setError(ret.body.params as any); }

            if (this.onProblem) { await this.onProblem(ret.body); }

            return false;
        } finally {
            this.#submitting[1](false);
        }
    }

    reset() { this.#object.reset(); }

    /**
     * 验证并返回对象
     */
    async object() { return await this.#object.object(this.#validator); }
}
