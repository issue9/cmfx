// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    ApiClass, ApiFunction, ApiInterface, ApiItem, ApiItemKind, ApiMethod, ApiMethodSignature,
    ApiProperty, ApiPropertySignature, ApiTypeAlias, ApiVariable
} from '@microsoft/api-extractor-model';

import { comment2String } from './utils';

const reactiveTag = '@reactive';
const defaultTag = '@default';

interface Doc {
    summary?: string;
    remarks?: string;
}

interface Named extends Doc {
    name: string;
}

/**
 * 定义方法和函数的参数
 */
export interface Parameter {
    name?: string; // 表示返回类型时则为空
    summary?: string;
    type: string;
}

export interface TypeParameter {
    name?: string; // 表示返回类型时则为空
    summary?: string;
    type?: string; // 表示的是约束类型。
}

/**
 * 定义类的结构
 */
interface Class extends Named {
    kind: 'class';
    typeParams?: Array<TypeParameter>;
    properties?: Array<Property & { static?: boolean, init?: string }>;
    methods?: Array<Method>;
}

/**
 * 定义接口
 */
interface Interface extends Named {
    kind: 'interface';
    typeParams?: Array<TypeParameter>;
    properties?: Array<Property & { reactive?: boolean }>;
}

/**
 * 定义函数
 */
interface Function extends Named {
    kind: 'function';
    typeParams?: Array<TypeParameter>;
    parameters: Array<Parameter>;
    return: Parameter;
}

interface TypeAlias extends Named {
    kind: 'typeAlias';
    typeParams?: Array<TypeParameter>;
    type: string; // 别名的后半部分
}

interface Variable extends Named {
    kind: 'variable';
    type: string;
    value?: string;
}

/**
 * 定义类属性
 */
export interface Property extends Named {
    type: string;
    def?: string; // 默认值
    optional?: boolean;
}

/**
 * 定义类的方法
 */
interface Method extends Named {
    typeParams?: Array<TypeParameter>;
    parameters: Array<Parameter>;
    return: Parameter;
    static?: boolean;
};

export type Type = TypeAlias | Variable | Class | Interface | Function;

/**
 * 将 ApiItem 转换为可表达为 JSON 的对象
 */
export function conv(item: ApiItem): Type {
    switch(item.kind) {
    case ApiItemKind.Class:
        return convClass(item as ApiClass);
    case ApiItemKind.Interface:
        return convInterface(item as ApiInterface);
    case ApiItemKind.TypeAlias:
        return convAlias(item as ApiTypeAlias);
    case ApiItemKind.Function:
        return convFunction(item as ApiFunction);
    case ApiItemKind.Variable:
        return convVariable(item as ApiVariable);
    default:
        throw new Error(`不支持的类型: ${item.kind}`);
    }
}

function convVariable(item: ApiVariable): Variable {
    return {
        kind: 'variable',
        name: item.name,
        summary: comment2String(item.tsdocComment?.summarySection),
        remarks: comment2String(item.tsdocComment?.remarksBlock),
        type: item.variableTypeExcerpt.text,
        value: item.initializerExcerpt?.text,
    };
}

function convClass(item: ApiClass): Class {
    return {
        kind: 'class',
        name: item.name,
        summary: comment2String(item.tsdocComment?.summarySection),
        remarks: comment2String(item.tsdocComment?.remarksBlock),

        typeParams: item.typeParameters.map(tp => ({
            name: tp.name,
            summary: comment2String(tp.tsdocTypeParamBlock?.content),
            type: tp.constraintExcerpt.text,
        })),

        methods: item.members
            .filter(m => m.kind === ApiItemKind.Method)
            .map(m => {
                const method = m as ApiMethod;
                const ret = convFunction(m as ApiFunction) as Method;
                ret.static = method.isStatic;
                return ret;
            }),
        properties: item.members
            .filter(m => m.kind === ApiItemKind.Property)
            .map(m => {
                const p = m as ApiProperty;
                return {
                    name: p.displayName,
                    summary: comment2String(p.tsdocComment?.summarySection),
                    remarks: comment2String(p.tsdocComment?.remarksBlock),
                    type: p.propertyTypeExcerpt.text,
                    def: comment2String(p.tsdocComment?.customBlocks.find(blk => blk.blockTag.tagName === defaultTag)?.content),
                    init: p.initializerExcerpt?.text,
                    reactive: p.tsdocComment?.modifierTagSet.hasTagName(reactiveTag),
                    optional: p.isOptional,
                    static: p.isStatic,
                };
            }),
    };
}

function convInterface(item: ApiInterface): Interface {
    return {
        kind: 'interface',
        name: item.name,
        summary: comment2String(item.tsdocComment?.summarySection),
        remarks: comment2String(item.tsdocComment?.remarksBlock),

        typeParams: item.typeParameters.map(tp => ({
            name: tp.name,
            summary: comment2String(tp.tsdocTypeParamBlock?.content),
            type: tp.constraintExcerpt.text,
        })),

        properties: item.members
            .filter(m => {
                return m.kind === ApiItemKind.PropertySignature
                    || m.kind === ApiItemKind.MethodSignature;
            })
            .map(m => {
                switch (m.kind) {
                case ApiItemKind.PropertySignature:
                    const prop = m as ApiPropertySignature;
                    return {
                        name: prop.displayName,
                        summary: comment2String(prop.tsdocComment?.summarySection),
                        remarks: comment2String(prop.tsdocComment?.remarksBlock),
                        type: prop.propertyTypeExcerpt.text,
                        def: comment2String(prop.tsdocComment?.customBlocks.find(blk => blk.blockTag.tagName === defaultTag)?.content),
                        reactive: prop.tsdocComment?.modifierTagSet.hasTagName(reactiveTag),
                        optional: prop.isOptional,
                    };
                case ApiItemKind.MethodSignature:
                    const method = m as ApiMethodSignature;
                    return {
                        name: method.displayName,
                        summary: comment2String(method.tsdocComment?.summarySection),
                        remarks: comment2String(method.tsdocComment?.remarksBlock),
                        type: method.excerpt.text,
                        def: comment2String(method.tsdocComment?.customBlocks.find(blk => blk.blockTag.tagName === defaultTag)?.content),
                        reactive: method.tsdocComment?.modifierTagSet.hasTagName(reactiveTag),
                        optional: method.isOptional,
                    };
                default:
                    throw new Error(`Unexpected ApiItemKind: ${m.kind}`);
                }
            }),
    };
}

function convAlias(item: ApiTypeAlias): TypeAlias {
    return {
        kind: 'typeAlias',
        name: item.name,
        summary: comment2String(item.tsdocComment?.summarySection),
        remarks: comment2String(item.tsdocComment?.remarksBlock),
        typeParams: item.typeParameters.map(param => ({
            name: param.name,
            summary: comment2String(param.tsdocTypeParamBlock?.content),
            type: param.defaultTypeExcerpt.text,
        })),
        type: item.typeExcerpt.text,
    };
}

function convFunction(item: ApiFunction): Function {
    return {
        kind: 'function',
        name: item.name,
        summary: comment2String(item.tsdocComment?.summarySection),
        remarks: comment2String(item.tsdocComment?.remarksBlock),
        parameters: item.parameters.map(param => ({
            name: param.name,
            summary: comment2String(param.tsdocParamBlock?.content),
            type: param.parameterTypeExcerpt.text,
        } as Parameter)),
        return: {
            type: item.returnTypeExcerpt.text,
            summary: comment2String(item.tsdocComment?.returnsBlock?.content),
        },
        typeParams: item.typeParameters.map(param => ({
            name: param.name,
            summary: comment2String(param.tsdocTypeParamBlock?.content),
            type: param.constraintExcerpt.text,
        } as Parameter)),
    };
}
