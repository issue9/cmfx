// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, Signal, untrack } from 'solid-js';
import { createStore, SetStoreFunction, Store, unwrap } from 'solid-js/store';

import { AppContext } from '@/components/context';
import { Problem, Return } from '@/core';

// Form 中保存错误的类型
type Err<T extends object> = {
    [K in keyof T]?: string;
};

/**
 * 每个表单元素通过调用此接口实现对表单数据的存取和一些基本信息的控制
 *
 * @template T 关联的值类型
 */
export interface Accessor<T> {
    /**
     * 字段的名称
     */
    name(): string;

    /**
     * 获取关联的值，这是一个响应式的值。
     */
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

    /**
     * 返回当前组件的错误信息
     */
    getError(): string | undefined;

    /**
     * 设置当前组件的错误信息
     * @param string 错误信息
     */
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
            const old = untrack(val);
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
    #preset: T;
    readonly #isPreset: Signal<boolean>;

    readonly #valGetter: Store<T>;
    readonly #valSetter: SetStoreFunction<T>;

    readonly #errGetter: Store<Err<T>>;
    readonly #errSetter: SetStoreFunction<Err<T>>;

    #accessor: Map<keyof T, Accessor<T[keyof T]>>;

    /**
     * 构造函数
     *
     * @pram preset 初始值；
     */
    constructor(preset: T) {
        this.#preset = preset;
        this.#isPreset = createSignal(true);

        [this.#valGetter, this.#valSetter] = createStore<T>({...preset});
        [this.#errGetter, this.#errSetter] = createStore<Err<T>>({});

        this.#accessor = new Map<keyof T, Accessor<T[keyof T]>>();
    }

    /**
     * 指定默认值，该功能与构造函数的 preset 参数功能是相同的。
     */
    setPreset(v: T) {
        this.#preset = v;
        this.#checkPreset();
    }

    /**
     * 判断当前保存的值是否为默认值
     *
     * 这是一个响应式的值
     */
    isPreset() { return this.#isPreset[0](); }

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
     * @param name 字段名称，根据此值查找对应的字段，同时也对应 {@link Accessor#name} 方法；
     * @param hasError 是否需要展示错误信息，对应 {@link Accessor#hasError} 方法；
     */
    accessor<FT = T[keyof T]>(name: keyof T, hasError?: boolean): Accessor<FT> {
        let a: Accessor<FT>|undefined = this.#accessor.get(name)as Accessor<FT>;
        if (a) { return a as Accessor<FT>; }

        const self = this;
        const changes: Array<ChangeFunc<FT>> = [];

        a = {
            name(): string { return name as string; },

            hasError(): boolean { return hasError ?? false; },

            getError(): string | undefined { return self.#errGetter[name]; },

            setError(err?: string): void { self.#errSetter({ [name]: err } as any); },

            onChange(change) { changes.push(change); },

            getValue(): FT { return self.#valGetter[name] as FT; },

            setValue(val: FT) {
                const old = untrack(this.getValue);
                if (old !== val) {
                    changes.forEach((f) => { f(val, old); });
                    self.#valSetter({ [name]: val } as any);
                }

                self.#checkPreset();
            },

            reset() {
                this.setError();
                this.setValue(self.#preset[name] as FT);
            }
        };
        this.#accessor.set(name, a as Accessor<T[keyof T]>);
        return a;
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
     * 修改整个对象的值
     */
    setObject(obj: T) {
        Object.entries(obj).forEach(([k, v]) => {
            this.accessor(k as keyof T).setValue(v);
        });
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
        this.#valSetter(this.#preset);
        this.#checkPreset();
    }
}

export interface SuccessFunc<T> {
    (r?: Return<T, never>): void;
}

export interface Request<T extends object, R = never, P = never> {
    (obj: T): Promise<Return<R, P>>;
}

/**
 * 适用于表单的 {@link ObjectAccessor}
 *
 * @template T 表示需要提交的对象类型；
 * @template R 表示服务端返回的类型；
 * @template P 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export class FormAccessor<T extends object, R = never, P = never> {
    #object: ObjectAccessor<T>;
    readonly #validation?: Validation<T>;
    #ctx: AppContext;
    #request: Request<T,R,P>;
    readonly #success?: SuccessFunc<R>;
    #submitting: Signal<boolean>;

    /**
     * 构造函数
     *
     * @param preset 初始值；
     * @param success 在接口正常返回时调用的方法；
     * @param validation 提交前对数据的验证方法；
     */
    constructor(preset: T, ctx: AppContext, req: Request<T, R, P>);
    constructor(preset: T, ctx: AppContext, req: Request<T, R, P>, success?: SuccessFunc<R>, validation?: Validation<T>);
    constructor(preset: T, ctx: AppContext, req: Request<T, R, P>, success?: SuccessFunc<R>, validation?: Validation<T>) {
        // NOTE: ctx 参数可以很好地限制此构造函数只能在组件中使用！
        this.#object = new ObjectAccessor(preset);
        this.#validation = validation;
        this.#ctx = ctx;
        this.#request = req;
        this.#success = success;
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
    accessor<FT = T[keyof T]>(name: keyof T): Accessor<FT> { return this.#object.accessor<FT>(name, true); }

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
            return await this.do();
        } finally {
            this.#submitting[1](false);
        }
    }

    reset() { this.#object.reset(); }

    private async do(): Promise<boolean> {
        const obj = this.#object.object(this.#validation);
        if (!obj) { return false; }

        const ret = await this.#request(unwrap(obj));
        if (ret.ok) {
            if (this.#success) {
                this.#success(ret);
            }
            return true;
        }

        this.#object.errorsFromProblem(ret.body);
        await this.#ctx.outputProblem(ret.body);
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
