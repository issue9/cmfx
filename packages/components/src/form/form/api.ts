// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable, FlattenKeys, Problem, Return, Validator } from '@cmfx/core';
import { createSignal, Signal } from 'solid-js';
import { unwrap } from 'solid-js/store';

import { Accessor } from '@/form/field';
import { ObjectAccessor } from './access';

interface SuccessFunc<T> {
    (r?: Return<T, never>): void;
}

interface Request<T extends Flattenable, R = never, P = never> {
    (obj: T): Promise<Return<R, P>>;
}

interface ProcessProblem<T = never> {
    (p: Problem<T>): Promise<void>;
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
    readonly #validator?: Validator<T>;
    readonly #pp?: ProcessProblem<P>;
    readonly #request: Request<T, R, P>;
    readonly #success?: SuccessFunc<R>;
    readonly #submitting: Signal<boolean>;

    /**
     * 构造函数
     *
     * @param preset - 初始值；
     * @param req - 提交数据的方法；
     * @param pp - 如果服务端返回的错误未得到处理，则调用此方法作最后处理；
     * @param succ - 在接口正常返回时调用的方法；
     * @param v - 提交前对数据的验证方法；
     */
    constructor(preset: T, req: Request<T, R, P>, pp?: ProcessProblem<P>);
    constructor(preset: T, req: Request<T, R, P>, pp?: ProcessProblem<P>, succ?: SuccessFunc<R>, v?: Validator<T>);
    constructor(preset: T, req: Request<T, R, P>, pp?: ProcessProblem<P>, succ?: SuccessFunc<R>, v?: Validator<T>) {
        // NOTE: act 参数可以很好地限制此构造函数只能在组件中使用！
        this.#object = new ObjectAccessor(preset);
        this.#validator = v;
        this.#pp = pp;
        this.#request = req;
        this.#success = succ;
        this.#submitting = createSignal<boolean>(false);
    }

    /**
     * 指示是否处于提交状态
     */
    submitting() { return this.#submitting[0](); }

    /**
     * 返回某个字段的 {@link Accessor} 接口供表单元素使用。
     *
     * NOTE: 即使指定的字段当前还不存在于当前对象，依然会返回一个 {@link Accessor} 接口，
     * 后续的 {@link Accessor#setValue} 会自动向当前对象添加该值。
     */
    accessor<FT = unknown, K extends string = string>(name: FlattenKeys<T>, kind?: K): Accessor<FT, K> {
        return this.#object.accessor<FT, K>(name, kind);
    }

    setPreset(v: T) { return this.#object.setPreset(v); }

    setObject(v: T) { return this.#object.setObject(v); }

    /**
     * 当前内容是否都是默认值
     */
    isPreset() { return this.#object.isPreset(); }

    /**
     * 提交数据
     *
     * @returns 表示接口是否成功调用
     */
    async submit(): Promise<boolean> {
        try {
            this.#submitting[1](true);
            return await this.req();
        } finally {
            this.#submitting[1](false);
        }
    }

    reset() { this.#object.reset(); }

    // 执行请求操作
    private async req(): Promise<boolean> {
        const obj = await this.#object.object(this.#validator);
        if (!obj) { return false; }

        const ret = await this.#request(unwrap(obj));
        if (ret.ok) {
            if (this.#success) { this.#success(ret); }
            return true;
        }

        if (!ret.body) { return true; }

        if (!this.#object.errorsFromProblem(ret.body) && this.#pp) {
            await this.#pp(ret.body);
        }
        return false;
    }
}
