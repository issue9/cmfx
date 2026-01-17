// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { DocComment, StandardTags } from '@microsoft/tsdoc';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
    ClassDeclaration, FunctionDeclaration, GetAccessorDeclaration, InterfaceDeclaration, JSDocableNode,
    MethodDeclaration, MethodSignature, ModuledNode, Node, ParameterDeclaration, Project, PropertyDeclaration,
    PropertySignature, Scope, SetAccessorDeclaration, Signature, Symbol, TypeAliasDeclaration, TypeChecker,
    TypeNode, TypeParameterDeclaration, Type as XType
} from 'ts-morph';

import { comment2String, getCustomDoc, getTsdoc, newTSDocParser, reactiveTag } from './tsdoc';
import {
    Class, ClassMethod, ClassProperty, Interface, InterfaceMethod, InterfaceProperty,
    Intersection, Literal, Parameter, ReturnType as RT, Source, Type, TypeParameter, Union
} from './types';

interface TSProject {
    checker: TypeChecker;
    exports: Map<string, ReturnType<ModuledNode['getExportedDeclarations']>>;
}

export class Extractor {
    #tsdocParser = newTSDocParser();
    #projects = new Map<string, TSProject>();

    /**
     * 加载项目中的 .d.ts 文档
     *
     * @param root - 项目的根目录；
     * @param entrypoints - 项目中需要引入的文件名，如果为空，则会采用 ['index.d.ts']；
     */
    load(root: string, ...entrypoints: Array<string>) {
        if (entrypoints.length === 0) {
            entrypoints = ['index.d.ts'];
        }

        const tsconfig = path.join(root, 'tsconfig.json');
        const project = new Project({
            tsConfigFilePath: tsconfig,
            skipAddingFilesFromTsConfig: true
        });

        // 项目名称
        const name = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf-8')).name;
        if (this.#projects.has(name)) {
            throw new Error(`项目 ${name} 已经加载`);
        }

        const outdir = project.compilerOptions.get().outDir ?? path.join(root, 'lib');

        const exports = new Map<string, ReturnType<ModuledNode['getExportedDeclarations']>>();
        for (const ep of entrypoints) {
            const dts = project.addSourceFileAtPath(path.join(outdir, ep));
            exports.set(ep, dts.getExportedDeclarations());
        }

        this.#projects.set(name, {
            checker: project.getTypeChecker(),
            exports: exports,
        });
    }

    /**
     * 查找指定名称的类型
     *
     * @param pkg - 包名称，一般为 package.json 中的名称；
     * @param entrypoint - .d.ts 文件名，比如 message.d.ts、index.d.ts 等；
     * @param names - 需要查找的类型名称列表；
     */
    extract(pkg: string, entrypoint: string, ...names: Array<string>): Array<Type> {
        const project = this.#projects.get(pkg);
        if (!project) {
            throw new Error(`项目 ${pkg} 未加载`);
        }

        const exports = project.exports.get(entrypoint);
        if (!exports) {
            throw new Error(`项目 ${pkg} 不存在入口点 ${entrypoint}`);
        }

        const types: Array<Type> = [];
        for (const name of names) {
            const ns = name.split(',');
            const source = ns.length > 1 ? (ns[1].toLowerCase() === 'source') : false;

            const typ = exports.get(ns[0]);
            if (!typ || typ.length === 0) {
                throw new Error(`${pkg}/${entrypoint} 中找不到类型 ${ns[0]}`);
            } else if (typ.length > 1) {
                throw new Error(`${pkg}/${entrypoint} 中有多个类型 ${ns[0]}`);
            }
            types.push(this.conv(typ[0], project.checker, source));
        }

        return types;
    }

    private conv(decl: Node, chk: TypeChecker, source?: boolean): Type {
        if (source) { return this.convSource(decl); }

        if (Node.isInterfaceDeclaration(decl)) {
            return this.fromInterfaceDeclaration(decl);
        } else if (Node.isClassDeclaration(decl)) {
            return this.fromClassDeclaration(decl);
        } else if (Node.isFunctionDeclaration(decl)) {
            return this.fromFunctionDeclaration(decl);
        } else if (Node.isTypeAliasDeclaration(decl)) {
            return this.fromTypeAliasDeclaration(decl, chk);
        } else {
            return this.convSource(decl);
        }
    }

    private convSource(decl: Node): Source {
        const tsdoc = Node.isJSDocable(decl) ? getTsdoc(this.#tsdocParser, decl as JSDocableNode) : undefined;
        return {
            kind: 'source',
            name: decl.getSymbol()?.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            source: trimSource(decl.getText()),
        };
    }

    private fromTypeAliasDeclaration(decl: TypeAliasDeclaration, chk: TypeChecker): Type {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);
        const name = decl.getName() ?? '';
        const summary = comment2String(tsdoc?.summarySection);
        const remarks = comment2String(tsdoc?.remarksBlock?.content);
        const typ = chk.getTypeAtLocation(decl);

        if (typ.isUnion()) { // type x = 'a' | 'b' | 'c'
            const unionTypes = typ.getUnionTypes();

            const intersectionIsLiteral = (t: XType): boolean => {
                return t.isLiteral() || t.isUndefined()
                    || (t.isIntersection() && t.getIntersectionTypes().every(i => i.isLiteral() || i.isUndefined()));
            };

            const unionIsLiteral = (t: XType): boolean => {
                return t.isLiteral() || t.isUndefined()
                    || (t.isUnion() && t.getUnionTypes().every(i => i.isLiteral() || i.isUndefined()));
            };

            if (unionTypes.every(intersectionIsLiteral)) { // 字符串类型的联合类型
                const ret: Literal = {
                    name, summary, remarks,
                    kind: 'literal',
                    type: typ.getText(),
                };
                return ret;
            }

            const unions: Union = {
                name, summary, remarks,
                kind: 'union',
                types: [],
            };
            for (const ut of unionTypes) {
                if (ut.isLiteral()) { break; } // 如果联合类型有一个是字面量，类型肯定没有区分联合类型的字段

                // 依次查询每个属性是否为区分联合类型
                for (const prop of ut.getProperties()) {
                    const name = prop.getName();

                    // 检测 unionTypes 中每个类型中字段名为 name 的属性值，
                    // 不存在或是不符合要求，则返回 undefined。
                    // 之后通过检测 values 是否包含 undefined 来判断该字段是否为区分联合类型。
                    const values: Array<string|undefined> = [];
                    for(const t of unionTypes) {
                        if (t.isLiteral() || t.isBoolean() || t.isNumber() || t.isString()) {
                            values.push(undefined);
                            break;
                        }

                        const p = t.getProperty(name);
                        if (!p) {
                            values.push(undefined);
                            break;
                        }

                        if (t.isIntersection()) { // 处理嵌套的 intersection 类型
                            for(const it of t.getIntersectionTypes()) {
                                const ip = it.getProperty(name);
                                if (!ip) {
                                    values.push(undefined);
                                    break;
                                }

                                const ret = ip.getTypeAtLocation(ip.getDeclarations()[0]);
                                if (!ret) {
                                    values.push(undefined);
                                    break;
                                }

                                if (!unionIsLiteral(ret)) {
                                    values.push(undefined);
                                    break;
                                }
                                values.push(ret.getText());
                            }
                        } else {
                            const ret = p.getTypeAtLocation(p.getValueDeclarationOrThrow());
                            if (!ret || !unionIsLiteral(ret)) {
                                values.push(undefined);
                                break;
                            }
                            values.push(ret.getText());
                        }
                    };

                    if (values.length>0 && values.every(v => v !== undefined)) {
                        unions.discriminant = name;
                        break;
                    }
                }
            }

            for(const t of unionTypes) {
                if (t.isIntersection()) {
                    const inter: Intersection = {
                        name: '',
                        kind: 'intersection',
                        types: t.getIntersectionTypes().map(t => {
                            return this.conv(t.getSymbol()?.getDeclarations()[0]!, chk);
                        }),
                    };
                    unions.types.push(inter);
                } else {
                    unions.types.push(this.conv(t.getSymbol()?.getDeclarations()[0]!, chk));
                }
            };

            return unions;
        } else if (typ.isIntersection()) { // type x = a & b
            if (typ.getIntersectionTypes().every(t=>t.isLiteral())) { // 字符串类型的交集
                const t: Literal = {
                    name, summary, remarks,
                    kind: 'literal',
                    type: typ.getIntersectionTypes().map(t => t.getText()).join(' & '),
                };
                return t;
            }

            const t: Intersection = {
                name, summary, remarks,
                kind: 'intersection',
                types: typ.getIntersectionTypes().map(t => {
                    return this.fromSymbols(t.getProperties(), 'interface');
                }),
            };
            return t;
        } else { // type x = Omit<x, 'a' | 'b'>
            const intf = this.fromSymbols(typ.getProperties(), 'interface');
            intf.name = decl.getName();
            return intf;
        }
    }

    /**
     * 从 getProperties() 方法返回的列表中构建一个 {@link Class} 或是 {@link Interface} 对象
     */
    private fromSymbols(symbols: Array<Symbol>, kind: 'class' | 'interface'): Interface | Class {
        switch (kind) {
        case 'class':
            const cp: Array<ClassProperty> = [];
            const cm: Array<ClassMethod> = [];

            for (const sym of symbols) {
                const decl = sym.getDeclarations()[0]!;

                if (Node.isPropertyDeclaration(decl)) {
                    if (decl.getScope() === Scope.Public && !decl.getName().startsWith('#')) {
                        cp.push(this.buildClassProperty(decl));
                    }
                } else if (Node.isMethodDeclaration(decl)) {
                    if (decl.getScope() === Scope.Public && !decl.getName().startsWith('#')) {
                        cm.push(this.fromMethodDeclaration(decl));
                    }
                } else if (Node.isGetAccessorDeclaration(decl)) {
                    if (decl.getScope() === Scope.Public && !decl.getName().startsWith('#')) {
                        this.appendGetAccessor2ClassProperties(cp, decl);
                    }
                } else if (Node.isSetAccessorDeclaration(decl)) {
                    if (decl.getScope() === Scope.Public && !decl.getName().startsWith('#')) {
                        this.appendSetAccessor2ClassProperties(cp, decl);
                    }
                }
            }

            const cls: Class = {
                kind: 'class',
                properties: cp.length > 0 ? cp : undefined,
                methods: cm.length > 0 ? cm : undefined,
            };
            return cls;
        case 'interface':
            const ip: Array<InterfaceProperty> = [];
            const im: Array<InterfaceMethod> = [];

            for (const sym of symbols) {
                const decl = sym.getDeclarations()[0]!;

                if (Node.isPropertySignature(decl)) {
                    ip.push(this.buildInterfaceProperty(decl));
                } else if (Node.isMethodSignature(decl)) {
                    im.push(this.fromMethodSignature(decl));
                } else if (Node.isGetAccessorDeclaration(decl)) {
                    this.appendGetAccessor2InterfaceProperties(ip, decl);
                } else if (Node.isSetAccessorDeclaration(decl)) {
                    this.appendSetAccessor2InterfaceProperties(ip, decl);
                }
            }

            const intf: Interface = {
                kind: 'interface',
                properties: ip.length > 0 ? ip : undefined,
                methods: im.length > 0 ? im : undefined,
            };
            return intf;
        }
    }

    private fromInterfaceDeclaration(decl: InterfaceDeclaration): Type {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        const symbols = decl.getType().getProperties(); // 包含父类
        const intf = this.fromSymbols(symbols, 'interface') as Interface;

        const tps = decl.getTypeParameters().map(param => this.fromTypeParamterDecleration(param, tsdoc));
        return {
            kind: 'interface',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            typeParams: tps.length > 0 ? tps : undefined,
            properties: intf.properties,
            methods: intf.methods,
        };
    }

    private fromClassDeclaration(decl: ClassDeclaration): Type {
        // NOTE: 类与 interface 稍有不同，类不会自动获取父类的属性的方法

        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        const f = (p: PropertyDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration) => {
            return p.getScope() === Scope.Public && !p.getName().startsWith('#');
        };

        const props: Array<ClassProperty> = decl.getProperties().filter(f)
            .map(prop => {
                return this.buildClassProperty(prop);
            });
        decl.getGetAccessors().filter(f)
            .forEach(accessor => this.appendGetAccessor2ClassProperties(props, accessor));
        decl.getSetAccessors().filter(f)
            .forEach(accessor => this.appendSetAccessor2ClassProperties(props, accessor));

        const tps = decl.getTypeParameters().map(param => this.fromTypeParamterDecleration(param, tsdoc));
        const methods = decl.getMethods().filter(f).map(method => this.fromMethodDeclaration(method));

        return {
            kind: 'class',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            typeParams: tps.length > 0 ? tps : undefined,
            properties: props.length > 0 ? props : undefined,
            methods: methods.length > 0 ? methods : undefined,
        };
    }

    private fromFunctionDeclaration(decl: FunctionDeclaration): Type {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        const tps = decl.getTypeParameters().map(param => this.fromTypeParamterDecleration(param, tsdoc));
        const params = decl.getParameters().map(p => this.formParameterDeclaration(p, tsdoc));
        return {
            kind: 'function',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            type: this.getFuncSig(decl.getType().getCallSignatures()[0]),
            typeParams: tps.length > 0 ? tps : undefined,
            params: params.length > 0 ? params : undefined,
            return: this.getReturnType(decl.getReturnTypeNode(), tsdoc),
        };
    }

    private appendGetAccessor2ClassProperties(props: Array<ClassProperty>, accessor: GetAccessorDeclaration) {
        const p = props.find(p => p.name === accessor.getName());
        if (p) {
            p.getter = true;
            return;
        }
        props.push(this.buildClassProperty(accessor));
    }

    private appendSetAccessor2ClassProperties(props: Array<ClassProperty>, accessor: SetAccessorDeclaration) {
        const p = props.find(p => p.name === accessor.getName());
        if (p) {
            p.setter = true;
            return;
        }
        props.push(this.buildClassProperty(accessor));
    }

    /**
     * 根据 decl 的类型生成不同字段的 {@link ClassProperty}
     */
    private buildClassProperty(
        decl: PropertyDeclaration | GetAccessorDeclaration | SetAccessorDeclaration
    ): ClassProperty {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);
        const prop: ClassProperty = {
            name: decl.getName(),
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            type: this.getType(decl),
            static: decl.isStatic() ? true : undefined,
        };

        if (Node.isPropertyDeclaration(decl)) {
            prop.readonly = decl.isReadonly() ? true : undefined;
            prop.def = decl.getInitializer()?.getText() ?? undefined;
        } else if (Node.isGetAccessorDeclaration(decl)) {
            prop.getter = true;
        } else if (Node.isSetAccessorDeclaration(decl)) {
            prop.setter = true;
        }

        return prop;
    }

    private appendGetAccessor2InterfaceProperties(props: Array<InterfaceProperty>, accessor: GetAccessorDeclaration) {
        const p = props.find(p => p.name === accessor.getName());
        if (p) {
            p.getter = true;
            return;
        }
        props.push(this.buildInterfaceProperty(accessor));
    }

    private appendSetAccessor2InterfaceProperties(props: Array<InterfaceProperty>, accessor: SetAccessorDeclaration) {
        const p = props.find(p => p.name === accessor.getName());
        if (p) {
            p.setter = true;
            return;
        }
        props.push(this.buildInterfaceProperty(accessor));
    }

    /**
     * 根据 decl 的类型生成不同字段的 {@link InterfaceProperty}
     */
    private buildInterfaceProperty(
        decl: PropertySignature | GetAccessorDeclaration | SetAccessorDeclaration
    ): InterfaceProperty {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);
        const prop: InterfaceProperty = {
            name: decl.getName(),
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            type: this.getType(decl),
            def: getCustomDoc(StandardTags.defaultValue.tagName, tsdoc),
            reactive: tsdoc?.modifierTagSet.hasTagName(reactiveTag) ? true : undefined,
        };


        if (Node.isGetAccessorDeclaration(decl)) {
            prop.getter = true;
        } else if (Node.isSetAccessorDeclaration(decl)) {
            prop.setter = true;
        } else if (Node.isPropertySignature(decl)) {
            prop.readonly = decl.isReadonly() ? true : undefined;
        }

        return prop;
    }

    private fromMethodDeclaration(method: MethodDeclaration): ClassMethod {
        const tsdoc = getTsdoc(this.#tsdocParser, method);
        const tps = method.getTypeParameters().map(param => this.fromTypeParamterDecleration(param, tsdoc));
        const params = method.getParameters().map(p => this.formParameterDeclaration(p, tsdoc));
        return {
            name: method.getName(),
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            type: this.getFuncSig(method.getType().getCallSignatures()[0]),
            typeParams: tps.length > 0 ? tps : undefined,
            params: params.length > 0 ? params : undefined,
            return: this.getReturnType(method.getReturnTypeNode(), tsdoc),
            static: method.isStatic(),
        };
    }

    private fromMethodSignature(method: MethodSignature): InterfaceMethod {
        const tsdoc = getTsdoc(this.#tsdocParser, method);
        const tps = method.getTypeParameters().map(param => this.fromTypeParamterDecleration(param, tsdoc));
        const params = method.getParameters().map(p => this.formParameterDeclaration(p, tsdoc));
        return {
            name: method.getName(),
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            type: this.getFuncSig(method.getType().getCallSignatures()[0]),
            typeParams: tps.length > 0 ? tps : undefined,
            params: params.length > 0 ? params : undefined,
            return: this.getReturnType(method.getReturnTypeNode(), tsdoc),
        };
    }

    private formParameterDeclaration(p: ParameterDeclaration, tsdoc?: DocComment): Parameter {
        const d = tsdoc?.params.blocks.find(block => block.parameterName === p.getName())?.content;
        const cp: Parameter = {
            name: p.getName(),
            summary: comment2String(d),
            type: this.getType(p),
            def: p.getInitializer()?.getText() ?? undefined,
        };
        return cp;
    }

    private getReturnType(node?: TypeNode, tsdoc?: DocComment): RT {
        return {
            summary: comment2String(tsdoc?.returnsBlock?.content),
            type: this.getType(node),
        };
    }

    private fromTypeParamterDecleration(decl: TypeParameterDeclaration, tsdoc?: DocComment): TypeParameter {
        const tt = this.getType(decl.getConstraint());
        const name = decl.getName();
        return {
            name: name,
            summary: comment2String(tsdoc?.typeParams.blocks.find(blk=>blk.parameterName === name)?.content),
            type: tt ? tt : 'any',
            init: decl.getDefault()?.getText() ?? undefined,
        };
    }

    private getFuncSig(sig: Signature): string {
        return trimSource(sig.getDeclaration().getText());
    }

    private getType(n?: Node): string {
        if (!n) { return ''; }

        const sf = n.getSourceFile();
        const txt = n.getType().getText(sf);
        if (!txt.includes('import(')) { return txt; }

        const alias = sf.getTypeAliasOrThrow(n.getType().getText());
        return alias.getTypeNodeOrThrow().getText();
    }
}

const exportDeclare = 'export declare ';

function trimSource(source: string): string {
    source = source.trim();
    source = source.startsWith(exportDeclare) ? source.slice(exportDeclare.length) : source;
    return source.endsWith(';') ? source.slice(0, -1) : source;
}
