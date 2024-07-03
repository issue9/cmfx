// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, JSX, Ref, createSignal } from 'solid-js';

import { Form, Object } from './form';

/**
 * 表单字段需要提供的接口
 */
export interface Field<T extends Exclude<unknown, Function>> {
    /**
     * 返回当前组件的最新值
     */
    getValue(): Accessor<T>;

    /**
     * 设置当前组件的值
     */
    setValue(v: T): void;

    /**
     * 设置当前组件的错误状态
     */
    setError(err: string): void;

    /**
     * 重置当前组件的状态为初状态
     */
    reset(): void;
}

export interface Props<T extends Object> {
    name: keyof T;
    ref: Ref<any>;
    children: JSX.Element;
    f: Form<T>;
}

export interface FieldAccesstor<T> {
    getValue(): T,
    setValue(v: T): void
}

/**
 * 实现了表单元素的基本属性，所有表单元素可采用此组件作为父组件。
 */
export default function<T extends Object>(props: Props<T>) {
    type ft = T[typeof props.name];
    const [getV,setV] = createSignal<ft>(props.f.getInitValue(props.name));
    const [getE,setE] = createSignal<string>('');

    props.f.add(props.name, {
        getValue() {
            return getV;
        },

        setValue(v: Exclude<ft,Function>) {
            setV(v);
        },

        setError(err) {
            setE(err);
        },

        reset() {
            setE('');
            setV(props.f.getInitValue(props.name));
        }
    });

    props.ref({
        getValue() { return getV; },
        setValue(v: ft) { setV(v); },
    });

    return <div class="field">
        {props.children}
        <p class="error" role="alert">{getE()}</p>
    </div>;
}
