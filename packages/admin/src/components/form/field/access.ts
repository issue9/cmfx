// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, untrack } from 'solid-js';

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
     * 是否需要给帮助信息预留位置
     *
     * 只有此值为 true 时，错误信息才会正确显示。
     */
    hasHelp(): boolean;

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

export interface ChangeFunc<T> {
    (val: T, old?: T): void;
}

/**
 * 为单个表单元素生成 {@link Accessor} 接口对象
 *
 * 当一个表单元素是单独使用的，可以传递此函数生成的对象。
 *
 * @param name 字段的名称，比如 radio 可能需要使用此值进行分组。
 * @param v 初始化的值；
 * @param hasHelp 是否显示错误信息的占位栏；
 * @template T 关联的值类型
 */
export function FieldAccessor<T>(name: string, v: T, hasHelp?: boolean): Accessor<T> {
    const [err, errSetter] = createSignal<string>();
    const [val, valSetter] = createSignal<T>(v);
    const changes: Array<ChangeFunc<T>> = [];

    return {
        name(): string { return name; },

        hasHelp(): boolean { return !!hasHelp; },

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
