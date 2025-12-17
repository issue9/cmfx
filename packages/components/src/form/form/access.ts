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
    readonly #accessors: Map<FlattenKeys<T>, Accessor<unknown, string>>;

    readonly #errGetter: Store<Err<T>>;
    readonly #errSetter: SetStoreFunction<Err<T>>;
    readonly #error: Signal<string>; // 全局错误信息

    readonly #validator?: Validator<T>;
    readonly #validOnChange?: boolean;

    /**
     * 构造函数
     *
     * @param preset - 初始值，该对象要求必须是可由 {@link structuredClone} 进行复制的；
     * @param validator - 验证器，用于验证表单数据的合法性；
     * @param validOnChange - 是否在每个字段被修改时就对该字段进行验证；
     */
    constructor(preset: T, validator?: Validator<T>, validOnChange?: boolean) {
        // NOTE: 如果 preset 是一个 createStore 创建的对象，无法复制其中的值作为默认值。
        this.#preset = preset;
        this.#isPreset = createSignal(true);

        [this.#valGetter, this.#valSetter] = createStore<T>(structuredClone(preset)); // 复制对象，防止与默认对象冲突。
        this.#accessors = new Map<FlattenKeys<T>, Accessor<unknown, string>>();

        [this.#errGetter, this.#errSetter] = createStore<Err<T>>({} as any);
        this.#error = createSignal('');

        this.#validator = validator;
        this.#validOnChange = validOnChange;
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
     * 返回当前关联的验证器
     */
    validator(): Validator<T> | undefined { return this.#validator; }

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
        if (this.#accessors.has(name)) { return this.#accessors.get(name) as Accessor<FT, K>; }

        const parent = this;
        const changes: Array<ChangeFunc<FT>> = [];
        const path = name.split('.');

        const a: Accessor<FT, K> = {
            kind(): K | undefined { return kind; },

            name(): string { return name as string; },

            getError(): string | undefined { return parent.#errGetter[name]; },

            setError(err?: string): void { parent.#errSetter(name as any, err as any); },

            onChange(change) { changes.push(change); },

            getValue(): FT {
                if (path.length === 1) { return parent.#valGetter[name] as FT; }

                const v = path.reduce<FT | T>((acc, key) => {
                    return key && acc ? (acc as T)[key] as FT : acc;
                }, parent.#valGetter);

                return (v ?? '') as FT;
            },

            setValue(val: FT) {
                const old = untrack(this.getValue);
                if (old !== val) {
                    changes.forEach(f => { f(val, old); });

                    parent.#valSetter(produce(draft => {
                        let target = draft as any; // as any 去掉只读属性！
                        for (let i = 0; i < path.length - 1; i++) {
                            target[path[i]] ??= {};
                            target = target[path[i]];
                        }
                        target[path[path.length - 1]] = val;
                    }));
                }

                parent.#checkPreset();
            },

            reset() {
                this.setError();
                this.setValue(parent.#preset[name] as FT);
            }
        };

        if (parent.#validOnChange && parent.#validator) {
            a.onChange(async val => {
                const rslt = await parent.#validator!.valid(val, name);
                a.setError(rslt[1] ? rslt[1][0].reason : undefined);
            });
        }

        this.#accessors.set(name, a);

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
     * @returns 在 validator 不为空且验证出错的情况下，会返回 undefined，
     * 其它情况下都将返回当前表单的最新值。
     * 与 {@link getValue} 的区别在于当前方法的返回值由 {@link unwrap} 进行了解绑。
     */
    async object(): Promise<T | undefined> {
        const v: T = unwrap<T>(this.#valGetter);
        if (!this.#validator) { return v; }

        const rslt = await this.#validator.valid(v);
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
     * @param errs - 错误列表，为空表示取消所有的错误显示，如果是字符串，表示未匹配的具体字段的错误；
     */
    setError(errs?: Params<FlattenKeys<T>> | string) {
        if (!errs) {
            this.#errSetter({} as any);
            this.#error[1]('');
            return;
        }

        if (typeof errs === 'string') {
            this.#error[1](errs);
            return;
        }

        errs.forEach(param => {
            this.accessor(param.name).setError(param.reason);
        });
    }

    /**
     * 返回表示当前整个对象的错误信息
     */
    getError(): string { return this.#error[0](); }

    /**
     * 重置所有字段的状态和值
     */
    reset() {
        this.setError();
        this.#valSetter(structuredClone(this.#preset));
        this.#checkPreset();
    }
}
