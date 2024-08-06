// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, Setter } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';

import { Fetcher, Method, Problem, Return } from '@/core';

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
 * 验证数据 obj 的函数签名
 *
 * 如果不存在错误，则返回 undefined，否则返回以字段名作为关键字的 map。
 */
export interface Validation<T extends object> {
    (obj: T): Map<keyof T, string> | undefined;
}

/**
 * 为单个表单元素生成 {@link Accessor} 接口对象
 *
 * 当一个表单元素是单独使用的，可以传递此函数生成的对象。
 *
 * @param name 字段的名称，比如 radio 可能需要使用此值进行分组。
 * @param v 初始化的值；
 * @param error 是否显示错误信息的占位栏；
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
 * 将一组 {@link Accessor} 存储至一个对象中
 *
 * T 表示当前存储的对象类型；
 */
export class ObjectAccessor<T extends object> {
    readonly #initValues: T;

    readonly #valGetter: Store<T>;
    readonly #valSetter: SetStoreFunction<T>;

    readonly #errGetter: Store<Err<T>>;
    readonly #errSetter: SetStoreFunction<Err<T>>;

    /**
     * 构造函数
     *
     * @pram preset 初始值；
     */
    constructor(preset: T) {
        this.#initValues = preset;
        [this.#valGetter, this.#valSetter] = createStore<T>(Object.assign({}, preset));
        [this.#errGetter, this.#errSetter] = createStore<Err<T>>({});
    }

    /**
     * 返回某个字段的 {@link Accessor} 接口供表单元素使用。
     *
     * FT 表示 name 字段的类型；
     * @param name 字段名称，根据此值查找对应的字段，同时也对应 {@link Accessor#name} 方法；
     * @param hasError 是否需要展示错误信息，对应 {@link Accessor#hasError} 方法；
     */
    accessor<FT extends T[keyof T]>(name: keyof T, hasError?: boolean): Accessor<FT> {
        const self = this;
        const changes: Array<ChangeFunc<FT>> = [];

        return {
            name(): string { return name as string; },

            hasError(): boolean { return hasError ?? false; },

            getError(): string | undefined { return self.#errGetter[name]; },

            setError(err?: string): void { self.#errSetter({ [name]: err } as any); },

            onChange(change) { changes.push(change); },

            getValue(): FT { return self.#valGetter[name] as FT; },

            setValue(val: FT) {
                const old = this.getValue();
                if (old !== val) {
                    changes.forEach((f) => { f(val, old); });
                    self.#valSetter({ [name]: val } as any);
                }
            },

            reset() {
                this.setError();
                this.setValue(self.#initValues[name] as FT);
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
    object(): T;
    object(validation?: Validation<T>): T | undefined;
    object(validation?: Validation<T>): T | undefined {
        const v: T = this.#valGetter;

        if (validation) {
            const errors = validation(v);
            if (errors) {
                errors.forEach((err, name) => { this.accessor(name, true).setError(err); });
                return;
            }
        }

        return v;
    }

    /**
     * 根据 {@link Problem} 设置当前对象的错误信息
     */
    errorsFromProblem<PE = never>(p?: Problem<PE>) {
        if (p && p.params) {
            p.params.forEach((param)=>{
                this.accessor(param.name as keyof T).setError(param.reason);
            });
        }
    }

    /**
     * 重置所有字段的状态和值
     */
    reset() {
        this.#errSetter({});
        this.#valSetter(this.#initValues);
    }
}

export interface SuccessFunc<T> {
    (r?: Return<T, never>): void;
}

export interface FailedFunc<T> {
    (r?: Return<never, T>): void;
}

/**
 * 适用于表单的 {@link ObjectAccessor}
 *
 * T 表示需要提交的对象类型；
 * R 表示服务端返回的类型；
 * P 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export class FormAccessor<T extends object, R = never, P = never> {
    #object: ObjectAccessor<T>;
    #method: Method;
    #path: string;
    #validation?: Validation<T>;
    #withToken: boolean;
    #fetcher: Fetcher;
    #success?: SuccessFunc<R>;
    #failed?: FailedFunc<P>;
    #loadingSetter?: Setter<boolean>;

    /**
     * 构造函数
     *
     * @param preset 初始值；
     * @param method 请求方法；
     * @param path 请求地址，相对于 {@link Options#api#base}；
     * @param success 在接口正常返回时调用的方法；
     * @param failed 在接口返回错误信息时调用的方法；
     * @param loadingSetter 用于向外界传递是否处于加载状态，如果不为空，在加载数据时会调用 loadingSetter(true)，加载完成或是出错时会调用 loadingSetter(false)；
     * @param validation 提交前对数据的验证方法；
     * @param withToken 接口是否需要带上登录凭证；
     */
    constructor(preset: T, f: Fetcher, method: Method, path: string);
    constructor(preset: T, f: Fetcher, method: Method, path: string, success?: SuccessFunc<R>, failed?: FailedFunc<P>, loadingSetter?: Setter<boolean>, validation?: Validation<T>, withToken?: boolean);
    constructor(preset: T, f: Fetcher, method: Method, path: string, success?: SuccessFunc<R>, failed?: FailedFunc<P>, loadingSetter?: Setter<boolean>, validation?: Validation<T>, withToken = true) {
        this.#object = new ObjectAccessor(preset);
        this.#method = method;
        this.#path = path;
        this.#validation = validation;
        this.#withToken = withToken;
        this.#fetcher = f;
        this.#success = success;
        this.#failed = failed;
        this.#loadingSetter = loadingSetter;
    }

    withLoadingSetter(s: Setter<boolean>) { this.#loadingSetter = s; }

    /**
     * 返回某个字段的 {@link Accessor} 接口供表单元素使用。
     */
    accessor<FT extends T[keyof T]>(name: keyof T): Accessor<FT> { return this.#object.accessor<FT>(name, true); }

    /**
     * 提交数据
     *
     * @returns 表示接口是否成功调用
     */
    async submit(): Promise<boolean> {
        if (!this.#loadingSetter) {
            return await this.do();
        }

        try {
            this.#loadingSetter(true);
            return await this.do();
        } finally {
            this.#loadingSetter(false);
        }
    }

    private async do(): Promise<boolean> {
        const obj = this.#object.object(this.#validation);
        if (!obj) { return false; }

        const ret = await this.#fetcher.request<R, P>(this.#path, this.#method, obj, this.#withToken);
        if (ret.ok) {
            if (this.#success) {
                this.#success(ret);
            }
            return true;
        }

        this.#object.errorsFromProblem(ret.body);

        if (this.#failed) {
            this.#failed(ret);
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
                self.#object.reset();
                e.preventDefault();
            },

            onSubmit(e: Event): void {
                self.submit();
                e.preventDefault();
            }
        };
    }
}
