// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable, FlattenKeys, Params, Validator } from '@cmfx/core';
import { createSignal, Signal, untrack } from 'solid-js';
import { createStore, produce, SetStoreFunction, Store, unwrap } from 'solid-js/store';

import { Accessor, ChangeFunc } from '@/form/field';

// ObjectAccessor 中保存错误的类型
type Err<T extends Flattenable> = Record<FlattenKeys<T>, string | undefined>;

/**
 * 将一组 {@link Accessor} 存储至一个对象中
 *
 * @typeParam T - 表示当前存储的对象类型，该对象要求必须是可由 {@link structuredClone} 复制的；
 */
export class ObjectAccessor<T extends Flattenable> {
    #preset: T;
    readonly #isPreset: Signal<boolean>;

    readonly #valGetter: Store<T>;
    readonly #valSetter: SetStoreFunction<T>;

    readonly #errGetter: Store<Err<T>>;
    readonly #errSetter: SetStoreFunction<Err<T>>;

    readonly #accessors: Map<FlattenKeys<T>, Accessor<unknown, string>>;

    /**
     * 构造函数
     *
     * @param preset - 初始值，该对象要求必须是可由 {@link structuredClone} 进行复制的；
     */
    constructor(preset: T) {
        // NOTE: 如果 preset 是一个 createStore 创建的对象，无法复制其中的值作为默认值。
        this.#preset = preset;
        this.#isPreset = createSignal(true);

        [this.#valGetter, this.#valSetter] = createStore<T>(structuredClone(preset)); // 复制对象，防止与默认对象冲突。
        [this.#errGetter, this.#errSetter] = createStore<Err<T>>({} as any);

        this.#accessors = new Map<FlattenKeys<T>, Accessor<unknown, string>>();
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
     * 返回某个字段的 {@link Accessor} 接口供表单元素使用
     *
     * @remarks
     * 即使指定的字段当前还不存在于当前对象，依然会返回一个 {@link Accessor} 接口，
     * 后续的 {@link Accessor#setValue} 会自动向当前对象添加该值。
     *
     * @typeParam FT - 表示 name 字段的类型；
     * @typeParam K - 这是对 T 的描述，当 T 的实际值为 undefined 等时，
     * 无法真正表示其类型，由 K 进行描述，通常是一个字符串类型的枚举类型；
     * @param name - 字段名称，根据此值查找对应的字段，同时也对应 {@link Accessor#name} 方法，
     * 嵌套字段可以用 . 相连，比如 a.b.c；
     * @param kind - 指定 {@link Accessor#kind} 的值；
     */
    accessor<FT = unknown, K extends string = string>(name: FlattenKeys<T>, kind?: K): Accessor<FT, K> {
        let a: Accessor<FT, K> | undefined = this.#accessors.get(name) as Accessor<FT, K>;
        if (a) { return a as Accessor<FT, K>; }

        const self = this;
        const changes: Array<ChangeFunc<FT>> = [];
        const path = (name as string).split('.');

        a = {
            kind(): K | undefined { return kind; },

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
        this.#accessors.set(name, a as Accessor<T[keyof T], K>);
        return a;
    }

    /**
     * 返回原始的存储对象
     *
     * @remarks
     * 是一个由 {@link createStore} 创建的对象。是一个可响应式的对象。
     */
    getValue(): Store<T> { return this.#valGetter; }

    /**
     * 返回当前对象的值
     *
     * @param validator - 是对返回之前对数据进行验证，如果此值非空，
     *  那么会验证数据，并在出错时调用每个字段的 setError 进行设置。
     *
     * @returns 在 validator 不为空且验证出错的情况下，会返回 undefined，
     * 其它情况下都将返回当前表单的最新值。
     * 与 {@link getValue} 的区别在于当前方法的返回值由 {@link unwrap} 进行了解绑。
     */
    async object(): Promise<T>;
    async object(validator?: Validator<T>): Promise<T | undefined>;
    async object(validator?: Validator<T>): Promise<T | undefined> {
        const v: T = unwrap<T>(this.#valGetter);
        if (!validator) { return v; }

        const rslt = await validator(v);
        if (!rslt[1]) { return rslt[0]; }

        this.setError(rslt[1]);
    }

    /**
     * 修改整个对象的值
     */
    setValue(obj: T) {
        Object.entries(obj).forEach(([k, v]) => {
            this.accessor(k as FlattenKeys<T>).setValue(v);
        });
    }

    /**
     * 将错误信息设置到指定的字段上
     *
     * @param errs - 错误列表，为空表示取消所有的错误显示；
     */
    setError(errs?: Params<FlattenKeys<T>>) {
        if (!errs) {
            this.#errSetter({} as any);
            return;
        }

        errs.forEach(param => {
            this.accessor(param.name).setError(param.reason);
        });
    }

    /**
     * 重置所有字段的状态和值
     */
    reset() {
        this.setError();
        this.#valSetter(structuredClone(this.#preset));
        this.#checkPreset();
    }
}
