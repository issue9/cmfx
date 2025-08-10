// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { FlattenKeys, FlattenObject, Problem, Return } from '@cmfx/core';
import { createSignal, Signal, untrack } from 'solid-js';
import { createStore, produce, unwrap } from 'solid-js/store';

import { Accessor, ChangeFunc } from './field';

// ObjectAccessor 中保存错误的类型
type Err<T extends FlattenObject> = Record<FlattenKeys<T>, string | undefined>;

/**
 * 验证数据 obj 的函数签名
 *
 * 如果不存在错误，则返回 undefined，否则返回以字段名作为关键字的 map。
 */
export interface Validation<T extends FlattenObject> {
    (obj: T): Map<FlattenKeys<T>, string> | undefined;
}

/**
 * 将一组 {@link Accessor} 存储至一个对象中
 *
 * @template T 表示当前存储的对象类型，该对象要求必须是可由 {@link structuredClone} 复制的；
 */
export class ObjectAccessor<T extends FlattenObject> {
    #preset: T;
    readonly #isPreset: Signal<boolean>;

    readonly #valGetter: ReturnType<typeof createStore<T>>[0];
    readonly #valSetter: ReturnType<typeof createStore<T>>[1];

    readonly #errGetter: ReturnType<typeof createStore<Err<T>>>[0];
    readonly #errSetter: ReturnType<typeof createStore<Err<T>>>[1];

    #accessors: Map<FlattenKeys<T>, Accessor<unknown>>;

    /**
     * 构造函数
     *
     * @pram preset 初始值，该对象要求必须是可由 {@link structuredClone} 进行复制的；
     */
    constructor(preset: T) {
        // NOTE: 如果 preset 是一个 createStore 创建的对象，无法复制其中的值作为默认值。
        this.#preset = preset;
        this.#isPreset = createSignal(true);

        [this.#valGetter, this.#valSetter] = createStore<T>(structuredClone(preset)); // 复制对象，防止与默认对象冲突。
        [this.#errGetter, this.#errSetter] = createStore<Err<T>>({} as any);

        this.#accessors = new Map<FlattenKeys<T>, Accessor<unknown>>();
    }

    /**
     * 指定默认值，该功能与构造函数的 preset 参数功能是相同的。
     */
    setPreset(v: T) {
        this.#preset = structuredClone(v);
        this.#checkPreset();
    }

    /**
     * 判断当前保存的值是否为默认值
     *
     * 这是一个响应式的值
     */
    isPreset() { return this.#isPreset[0](); }

    /**
     * 检测是否所有值都是默认值
     *
     * @returns 如果都是默认值则返回 true
     */
    #checkPreset() {
        const keys = Object.keys(this.#preset) as Array<keyof T>;
        const vals = unwrap(this.#valGetter);

        for (const k of keys) {
            if (this.#preset[k] !== vals[k]) {
                this.#isPreset[1](false);
                return;
            }
        }
        this.#isPreset[1](true);
    }

    /**
     * 返回某个字段的 {@link Accessor} 接口供表单元素使用。
     *
     * NOTE: 即使指定的字段当前还不存在于当前对象，依然会返回一个 {@link Accessor} 接口，
     * 后续的 {@link Accessor#setValue} 会自动向当前对象添加该值。
     *
     * @template FT 表示 name 字段的类型；
     * @param name 字段名称，根据此值查找对应的字段，同时也对应 {@link Accessor#name} 方法，
     * 嵌套字段可以用 . 相连，比如 a.b.c；
     */
    accessor<FT = unknown>(name: FlattenKeys<T>): Accessor<FT> {
        let a: Accessor<FT> | undefined = this.#accessors.get(name) as Accessor<FT>;
        if (a) { return a as Accessor<FT>; }

        const self = this;
        const changes: Array<ChangeFunc<FT>> = [];
        const path = (name as string).split('.');

        a = {
            name(): string { return name as string; },

            getError(): string | undefined { return self.#errGetter[name]; },

            setError(err?: string): void { self.#errSetter({ [name]: err } as any); },

            onChange(change) { changes.push(change); },

            getValue(): FT {
                if (path.length === 1) { return self.#valGetter[name] as FT; }

                const v = path.reduce<FT | T>((acc, key) => {
                    return key && acc ? (acc as T)[key] as FT : acc;
                }, self.#valGetter);

                return (v ?? '') as FT;
            },

            setValue(val: FT) {
                const old = untrack(this.getValue);
                if (old !== val) {
                    changes.forEach((f) => { f(val, old); });

                    self.#valSetter(produce((draft) => {
                        let target = draft as any; // as any 去掉只读属性！
                        for (let i = 0; i < path.length - 1; i++) {
                            target[path[i]] ??= {};
                            target = target[path[i]];
                        }
                        target[path[path.length - 1]] = val;
                    }));
                }

                self.#checkPreset();
            },

            reset() {
                this.setError();
                this.setValue(self.#preset[name] as FT);
            }
        };
        this.#accessors.set(name, a as Accessor<T[keyof T]>);
        return a;
    }

    /**
     * 返回当前对象的值
     *
     * @param validation 是对返回之前对数据进行验证，如果此值非空，
     *  那么会验证数据，并在出错时调用每个字段的 setError 进行设置。
     *
     * @returns 在 validation 不为空且验证出错的情况下，会返回 undefined，
     *  其它情况下都将返回当前表单的最新值。
     */
    object(validation?: Validation<T>): T;
    object(validation?: Validation<T>): T | undefined {
        const v: T = this.#valGetter;

        if (validation) {
            const errors = validation(v);
            if (errors) {
                errors.forEach((err, name) => { this.accessor(name).setError(err); });
                return;
            }
        }

        return v;
    }

    /**
     * 修改整个对象的值
     */
    setObject(obj: T) {
        Object.entries(obj).forEach(([k, v]) => {
            this.accessor(k as FlattenKeys<T>).setValue(v);
        });
    }

    /**
     * 根据 {@link Problem} 设置当前对象的错误信息
     *
     * @returns 错误是否已经被处理；
     */
    errorsFromProblem<PE = never>(p?: Problem<PE>):boolean {
        if (p && p.params) {
            p.params.forEach(param => {
                this.accessor(param.name as FlattenKeys<T>).setError(param.reason);
            });
        }
        return !!p && !!p.params && p.params.length > 0;
    }

    /**
     * 重置所有字段的状态和值
     */
    reset() {
        this.#errSetter({} as any);
        this.#valSetter(structuredClone(this.#preset));
        this.#checkPreset();
    }
}

interface SuccessFunc<T> {
    (r?: Return<T, never>): void;
}

interface Request<T extends FlattenObject, R = never, P = never> {
    (obj: T): Promise<Return<R, P>>;
}

interface ProcessProblem<T = never> {
    (p: Problem<T>): Promise<void>;
}

/**
 * 适用于表单的 {@link ObjectAccessor}
 *
 * @template T 表示需要提交的对象类型；
 * @template R 表示服务端返回的类型；
 * @template P 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export class FormAccessor<T extends FlattenObject, R = never, P = never> {
    readonly #object: ObjectAccessor<T>;
    readonly #validation?: Validation<T>;
    readonly #pp?: ProcessProblem<P>;
    readonly #request: Request<T, R, P>;
    readonly #success?: SuccessFunc<R>;
    readonly #submitting: Signal<boolean>;

    /**
     * 构造函数
     *
     * @param preset 初始值；
     * @param req 提交数据的方法；
     * @param pp 如果服务端返回的错误未得到处理，则调用此方法作最后处理；
     * @param succ 在接口正常返回时调用的方法；
     * @param v 提交前对数据的验证方法；
     */
    constructor(preset: T, req: Request<T, R, P>, pp?: ProcessProblem<P>);
    constructor(preset: T, req: Request<T, R, P>, pp?: ProcessProblem<P>, succ?: SuccessFunc<R>, v?: Validation<T>);
    constructor(preset: T, req: Request<T, R, P>, pp?: ProcessProblem<P>, succ?: SuccessFunc<R>, v?: Validation<T>) {
        // NOTE: act 参数可以很好地限制此构造函数只能在组件中使用！
        this.#object = new ObjectAccessor(preset);
        this.#validation = v;
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
    accessor<FT = unknown>(name: FlattenKeys<T>): Accessor<FT> { return this.#object.accessor<FT>(name); }

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
        const obj = this.#object.object(this.#validation);
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

    /**
     * 生成符合 form 的 onReset 和 onSubmit 事件
     */
    events() {
        const self = this;

        return {
            onReset(e: Event): void {
                self.reset();
                e.preventDefault();
            },

            async onSubmit(e: Event) {
                await self.submit();
                e.preventDefault();
            }
        };
    }
}
