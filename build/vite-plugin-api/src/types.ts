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

interface Pakcage {
	/**
	 * 所在的包名称
	 */
	pkg?: string;
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

	// 从 d.ts 中获取的函数，默认参数始终为空
	// def?: string;
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
 * 定义类的方法
 */
export interface ClassMethod extends InterfaceMethod {
	static?: boolean;
}

/**
 * 定义类的结构
 */
export interface Class extends Doc, Pakcage {
	kind: 'class';
	name?: string;
	typeParams?: Array<TypeParameter>;
	properties?: Array<ClassProperty>;
	methods?: Array<ClassMethod>;
}

/**
 * 定义接口
 */
export interface Interface extends Doc, Pakcage {
	kind: 'interface';
	name?: string; // 作为别名后部分时，该值为空。
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
export interface Source extends Named, Pakcage {
	kind: 'source';
	source?: string;
}

/**
 * 定义函数
 */
export interface Function extends InterfaceMethod, Pakcage {
	kind: 'function';
}

/**
 * 字面量类型
 */
export interface Literal extends Named, Pakcage {
	kind: 'literal';
	type: string;
}

export interface Union extends Named, Pakcage {
	kind: 'union';

	typeParams?: Array<TypeParameter>;
	discriminant?: string; // 区分联合类型的字段名
	types: Array<Type>;
}

export interface Intersection extends Named, Pakcage {
	kind: 'intersection';

	typeParams?: Array<TypeParameter>;
	types: Array<Type>;
}

export type Type = Class | Interface | Function | Literal | Union | Intersection | Source;
