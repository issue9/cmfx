// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';

import { Fetcher, Method, Problem } from '@/core';

// Form 中保存错误的类型
type Err<T> = {
    [K in keyof T]?: string;
};

/**
 * 每个表单元素通过调用此接口实现对表单数据的存取和一些基本信息的控制
 */
export interface Accessor<T> {
    /**
     * 字段的名称
     */
    name(): string;

    getValue(): T;

    /**
     * 修改值，如果与旧值相同，则不会触发修改。
     */
    setValue(val: T): void;

    /**
     * 注册值发生改变时的触发函数
     */
    onChange(change: ChangeFunc<T>): void;

    /**
     * 是否需要给错误信息预留位置
     */
    hasError(): boolean;
    getError(): string | undefined;
    setError(string?: string): void;

    /**
     * 重置为初始状态
     */
    reset(): void;
}

interface ChangeFunc<T> {
    (val: T, old?: T): void;
}

/**
 * 验证数据的函数签名
 *
 * 如果不存在错误，则不返回内容，否则返回以字段名作为关键字的 map。
 */
export interface Validation<T extends Record<string, unknown>> {
    (obj: T): Map<keyof T, string> | undefined;
}

/**
 * 为单个表单元素生成 {@link Accessor} 接口对象
 *
 * 当一个表单元素是单独使用的，可以传递此函数生成的对象。
 *
 * @param name 字段的名称，比如 radio 可能需要使用此值进行分组。
 * @param v 初始化的值；
 */
export function FieldAccessor<T>(name: string, v: T, error?: boolean): Accessor<T> {
    const [err, errSetter] = createSignal<string>();
    const [val, valSetter] = createSignal<T>(v);
    const changes: Array<ChangeFunc<T>> = [];

    return {
        name(): string { return name; },

        hasError(): boolean { return !!error; },

        getError(): string | undefined { return err(); },

        setError(err: string): void { errSetter(err); },

        onChange(change) { changes.push(change); },

        getValue(): T { return val(); },

        setValue(vv: T) {
            const old = val();
            if (old === vv) { return; }

            valSetter(vv as any);
            changes.forEach((f) => {
                f(vv, old);
            });
        },

        reset() {
            this.setValue(v);
            errSetter();
        }
    };
}

/**
 * 用于处理表单组件中对表单数据的存取
 */
export class FormAccessor<T extends Record<string, unknown>> {
    readonly #initValues: T;

    readonly #valGetter: Store<T>;
    readonly #valSetter: SetStoreFunction<T>;

    readonly #errGetter: Store<Err<T>>;
    readonly #errSetter: SetStoreFunction<Err<T>>;

    constructor(val: T) {
        this.#initValues = val;
        [this.#valGetter, this.#valSetter] = createStore<T>(Object.assign({}, val));
        [this.#errGetter, this.#errSetter] = createStore<Err<T>>({});
    }

    /**
     * 返回某个字段的 {@link Accessor} 接口供表单元素使用。
     */
    accessor(name: keyof T): Accessor<T[keyof T]> {
        const self = this;
        const changes: Array<ChangeFunc<T[keyof T]>> = [];

        return {
            name(): string { return name as string; },

            hasError(): boolean { return true; },

            getError(): string | undefined { return self.#errGetter[name]; },

            setError(err?: string): void { self.#errSetter({ [name]: err } as any); },

            onChange(change) { changes.push(change); },

            getValue(): T[keyof T] { return self.#valGetter[name]; },

            setValue(val: T[keyof T]) {
                const old = this.getValue();
                if (old !== val) {
                    changes.forEach((f) => { f(val, old); });
                    self.#valSetter({ [name]: val } as any);
                }
            },

            reset() {
                this.setError();
                this.setValue({ [name]: self.#initValues[name] } as any);
            }
        };
    }


    /**
     * 返回需要提交的对象
     *
     * @param validation 是对返回之前对数据进行验证，如果此值非空，
     *  那么会验证数据，并在出错时调用每个字段的 setError 进行设置。
     *
     * @returns 在 validation 不为空且验证出错的情况下，会返回 undefined，
     *  其它情况下都将返回当前表单的最新值。
     */
    object(validation?: Validation<T>): T|undefined {
        const v: T = this.#valGetter;

        if (validation) {
            const errors = validation(v);
            if (errors) {
                errors?.forEach((err, name)=>{
                    this.accessor(name).setError(err);
                });
            }
        }

        return v;
    }

    /**
     * 提交数据
     *
     * @returns 如果验证出错，将返回 false；否则返回 R 的实例或是在没有的情况返回 undefined。
     */
    async submit<R>(f: Fetcher,method: Method, path: string,validation?: Validation<T>, withToken = true): Promise<R|undefined|false> {
        const obj = this.object(validation);
        if (!obj) { return false; }

        const ret = await f.request<R>(path, method, obj, withToken);
        if (ret.ok) {
            return ret.body as Exclude<typeof ret.body,Problem>;
        }

        const p = ret.body!;
        if (p.params) {
            p.params.forEach((param)=>{
                this.accessor(param.name).setError(param.reason);
            });
        }

        return false;
    }

    /**
     * 生成符合 form 的 onReset 和 onSubmit 事件
     */
    events(f: Fetcher,method: Method, path: string,validation?: Validation<T>, withToken = true) {
        const self = this;

        return {
            onReset(e: Event): void {
                self.reset();
                e.preventDefault();
            },

            onSubmit(e: Event): void {
                self.submit(f, method, path, validation, withToken);
                e.preventDefault();
            }
        };
    }

    /**
     * 重置所有字段的状态和值
     */
    reset() {
        this.#errSetter({});
        this.#valSetter(this.#initValues);
    }
}