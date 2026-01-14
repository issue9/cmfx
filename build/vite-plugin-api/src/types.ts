// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

interface Doc {
    summary?: string;
    remarks?: string;
}

interface Named extends Doc {
    name: string;
}

export interface Property extends Named {
    type: string;
    def?: string; // 默认值或是类中的初始值
    readonly?: boolean;
    getter?: boolean;
    setter?: boolean;
}

/**
 * 定义方法和函数的参数
 */
export interface Parameter {
    name?: string; // 表示返回类型时则为空
    summary?: string;
    type: string;
    def?: string;
}

export interface ReturnType {
    summary?: string;
    type?: string; // 表示的是约束类型。
}

export interface TypeParameter {
    name?: string; // 表示返回类型时则为空
    summary?: string;
    type?: string; // 表示的是约束类型
    init?: string; // 表示默认的类型
}

export interface ClassProperty extends Property {
    static?: boolean;
}

/**
 * 定义类的方法
 */
export interface ClassMethod extends Named {
    type: string; // 方法的整体签名
    static?: boolean;
    typeParams?: Array<TypeParameter>;
    params?: Array<Parameter>;
    return: ReturnType;
};

export interface InterfaceProperty extends Property {
    reactive?: boolean;
}

export interface InterfaceMethod extends Named {
    type: string; // 方法的整体签名
    typeParams?: Array<TypeParameter>;
    params?: Array<Parameter>;
    return: ReturnType;
}

/**
 * 定义类的结构
 */
export interface Class extends Named {
    kind: 'class';
    typeParams?: Array<TypeParameter>;
    properties?: Array<ClassProperty>;
    methods?: Array<ClassMethod>;
}

/**
 * 定义接口
 */
export interface Interface extends Named {
    kind: 'interface';
    typeParams?: Array<TypeParameter>;
    properties?: Array<InterfaceProperty>;
    methods?: Array<InterfaceMethod>;
}

/**
 * 表示源代码格式
 *
 * @remarks
 * 所有未指定的类型，也放在此类型上。
 */
export interface Source extends Named {
    kind: 'source';
    source?: string;
}

/**
 * 定义函数
 */
export interface Function extends Named {
    kind: 'function';
    type: string;
    typeParams?: Array<TypeParameter>;
    params?: Array<Parameter>;
    return: ReturnType;
}

export interface Alias extends Named {
    kind: 'alias';
    typeParams?: Array<TypeParameter>;

    type: AliasLiteral | AliasUnion | AliasIntersection; // 别名的后半部分。
}

export interface AliasLiteral {
    kind: 'literal';
    type: string;
}

export interface AliasUnion {
    kind: 'union';
    discriminant?: string; // 区分联合类型的字段名
    type: Array<Type>;
}

export interface AliasIntersection {
    kind: 'intersection';
    type: Array<Type>;
}

export type Type =  Class | Interface | Function | Alias | Source;
