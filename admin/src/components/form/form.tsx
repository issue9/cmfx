// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor } from 'solid-js';

import { Fetcher, Method, Problem } from '@/core';
import { Field } from './field';

export interface Object {
    [k: string]: Exclude<any, Function>;
}

/**
 * 验证数据的函数签名
 *
 * 如果不存在错误，则不返回内容，否则返回以字段名作为关键字的 map。
 */
export interface Validation<T extends Object> {
    (obj: T): Map<string, string> | undefined;
}

/**
 * 用于处理表单组件中的数据
 */
export class Form<T extends Object> {
    readonly #initValues: T;
    readonly #fields: Map<keyof T,Field<T[keyof T]>>;

    constructor(val: T) {
        this.#initValues = val;
        this.#fields = new Map();
    }

    /**
     * 获取指定名称的初始值
     *
     * 一般由 field 的实现都调用。
     */
    getInitValue(name: keyof T) {
        return this.#initValues[name];
    }

    /**
     * 获取指定名称的值
     */
    get(name: keyof T): Accessor<T[keyof T]> {
        return this.#fields.get(name)!.getValue();
    }

    /**
     * 添加一个字段的定义
     *
     * 一般由 field 的实现都调用。
     */
    add(name: keyof T, field: Field<T[keyof T]>) {
        this.#fields.set(name, field);
        field.setValue(this.#initValues[name]); // 初始化默认值
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
        const v: T = Object.assign({}, this.#initValues);
        this.#fields.forEach((field,name)=>{
            if (v[name] !== undefined) {
                v[name] = field.getValue()();
            }
        });

        if (validation) {
            const errors = validation(v);
            if (errors) {
                errors?.forEach((err, name)=>{
                    this.#fields.get(name)?.setError(err);
                });
            }
        }

        return v;
    }

    /**
     * 提交数据
     *
     * @returns 如果验证出错，将返回 false；否则返回 O 的实例或是在没有的情况返回 undefined。
     */
    async submit<O>(f: Fetcher,method: Method, path: string,validation?: Validation<T>, withToken = true): Promise<O|undefined|false> {
        const obj = this.object(validation);
        if (!obj) {
            return false;
        }

        const ret = await f.request<O>(path, method, obj, withToken);
        if (ret.ok) {
            return ret.body as Exclude<typeof ret.body,Problem>;
        }

        const p = ret.body as Problem;
        if (!p.params) {
            return false;
        }
        p.params.forEach((param)=>{
            this.#fields.get(param.name)?.setError(param.reason);
        });

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
        this.#fields.forEach((field)=>{
            field.reset();
        });
    }
}
