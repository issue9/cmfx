// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { DocComment, StandardTags } from '@microsoft/tsdoc';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
    ClassDeclaration, FunctionDeclaration, InterfaceDeclaration, ModuledNode, Node, ParameterDeclaration,
    Project, TypeAliasDeclaration, TypeChecker, TypeNode, TypeParameterDeclaration, Type as XType
} from 'ts-morph';

import { comment2String, getCustomDoc, getTsdoc, newTSDocParser, reactiveTag } from './tsdoc';
import {
    Alias, AliasUnion, ClassMethod, ClassProperty, InterfaceMethod,
    InterfaceProperty, Parameter, ReturnType as RT, Type, TypeParameter
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
            throw new Error(`入口点 ${entrypoint} 未找到`);
        }

        const types: Array<Type> = [];
        for (const name of names) {
            const typ = exports.get(name);
            if (!typ || typ.length === 0) {
                throw new Error(`类型 ${name} 未找到`);
            } else if (typ.length > 1) {
                throw new Error(`类型 ${name} 有多个定义`);
            }
            types.push(this.conv(typ[0], project.checker));
        }

        return types;
    }

    private conv(decl: Node, chk: TypeChecker): Type {
        if (Node.isInterfaceDeclaration(decl)) {
            return this.convInterface(decl);
        } else if (Node.isClassDeclaration(decl)) {
            return this.convClass(decl);
        } else if (Node.isFunctionDeclaration(decl)) {
            return this.convFunction(decl);
        } else if (Node.isTypeAliasDeclaration(decl)) {
            return this.convAlias(decl, chk);
        }

        return {
            kind: 'source',
            source: decl.getText(),
        };
    }

    private getType(n?: Node): string {
        if (!n) { return ''; }

        const sf = n.getSourceFile();
        const txt = n.getType().getText(sf);
        if (!txt.includes('import(')) { return txt; }

        const alias = sf.getTypeAliasOrThrow(n.getType().getText());
        return alias.getTypeNodeOrThrow().getText();
    }

    private getTypeParam(decl: TypeParameterDeclaration, tsdoc?: DocComment): TypeParameter {
        const tt = this.getType(decl.getConstraint());
        const name = decl.getName();
        return {
            name: name,
            summary: comment2String(tsdoc?.typeParams.blocks.find(blk=>blk.parameterName === name)?.content),
            type: tt ? tt : 'any',
            init: decl.getDefault()?.getText() ?? undefined,
        };
    }

    private getReturnType(node?: TypeNode, tsdoc?: DocComment): RT {
        return {
            summary: comment2String(tsdoc?.returnsBlock?.content),
            type: this.getType(node),
        };
    }

    // 获取函数参数
    private getParam(p: ParameterDeclaration, tsdoc?: DocComment): Parameter {
        const d = tsdoc?.params.blocks.find(block => block.parameterName === p.getName())?.content;
        const cp: Parameter = {
            name: p.getName(),
            summary: comment2String(d),
            type: this.getType(p),
            def: p.getInitializer()?.getText() ?? undefined,
        };
        return cp;
    }

    private convAlias(decl: TypeAliasDeclaration, chk: TypeChecker): Type {
        // 判断 t 是否为标准库的类型
        const isStd = (t: Node): boolean => {
            const sourceFile = t.getSourceFile();
            return sourceFile.getFilePath().includes('typescript/lib/lib.');
        };

        // 判断 t 是否为第三方包中的类型
        const isModules = (t: Node): boolean => {
            const sourceFile = t.getSourceFile();
            return sourceFile.getFilePath().includes('node_modules/');
        };

        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        const alias: Alias = {
            kind: 'alias',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
        } as Alias;

        const typ = chk.getTypeAtLocation(decl);

        if (typ.getSymbol()?.getDeclarations().every(v=>isStd(v) || isModules(v))) {
            alias.type = {
                kind: 'literal', // 严格来说这不是 literal，但是不展示了，就直接当作 literal 处理。
                type: typ.getText(),
            };
        }else if (typ.isUnion()) {
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
                alias.type = {
                    kind: 'literal',
                    type: unionTypes.map(t => t.getText()).join(' | '),
                };
                return alias;
            }

            const unions: AliasUnion = {
                kind: 'union',
                type: [],
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
                    unions.type.push({
                        kind: 'alias',
                        name: '',
                        type: {
                            kind: 'intersection',
                            type: t.getIntersectionTypes().map(t => {
                                return this.conv(t.getSymbol()?.getDeclarations()[0]!, chk);
                            }),
                        },
                    });
                } else {
                    unions.type.push(this.conv(t.getSymbol()?.getDeclarations()[0]!, chk));
                }
            };

            alias.type = unions;
        } else if (typ.isIntersection()) {
            if (typ.getIntersectionTypes().every(t=>t.isLiteral())) { // 字符串类型的交集
                alias.type = {
                    kind: 'literal',
                    type: typ.getIntersectionTypes().map(t => t.getText()).join(' & '),
                };
                return alias;
            }

            alias.type = {
                kind: 'intersection',
                type: typ.getIntersectionTypes().map(t => {
                    return this.conv(t.getSymbol()?.getDeclarations()[0]!, chk);
                    //return t.isLiteral() ? t.getLiteralValue() : t.getText();
                }),
            };
        } else { // 其它情况应该只有一个 declarations
            alias.type = {
                kind: 'literal',
                type: typ.getText(),
            };
        }

        return alias;
    }

    private convInterface(decl: InterfaceDeclaration): Type {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        return {
            kind: 'interface',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),

            typeParams: decl.getTypeParameters().map(param => this.getTypeParam(param, tsdoc)),

            properties: decl.getProperties().map(prop => {
                const tsdoc = getTsdoc(this.#tsdocParser, prop);
                const ip: InterfaceProperty = {
                    name: prop.getName(),
                    summary: comment2String(tsdoc?.summarySection),
                    remarks: comment2String(tsdoc?.remarksBlock?.content),
                    type: this.getType(prop),
                    def: getCustomDoc(StandardTags.defaultValue.tagName, tsdoc),
                    reactive: tsdoc?.modifierTagSet.hasTagName(reactiveTag)
                };
                return ip;
            }),

            methods: decl.getMethods().map(method => {
                const tsdoc = getTsdoc(this.#tsdocParser, method);
                const im: InterfaceMethod = {
                    name: method.getName(),
                    summary: comment2String(tsdoc?.summarySection),
                    remarks: comment2String(tsdoc?.remarksBlock?.content),
                    type: this.getType(method),
                    typeParams: method.getTypeParameters().map(param => this.getTypeParam(param, tsdoc)),
                    params: method.getParameters().map(p => this.getParam(p, tsdoc)),
                    return: this.getReturnType(method.getReturnTypeNode(), tsdoc),
                };
                return im;
            }),
        };
    }

    private convClass(decl: ClassDeclaration): Type {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        const props: Array<ClassProperty> = decl.getProperties().map(prop => {
            const tsdoc = getTsdoc(this.#tsdocParser, prop);
            const cp: ClassProperty = {
                name: prop.getName(),
                summary: comment2String(tsdoc?.summarySection),
                remarks: comment2String(tsdoc?.remarksBlock?.content),
                type: this.getType(prop),
                def: prop.getInitializer()?.getText() ?? undefined,
                static: prop.isStatic(),
            };
            return cp;
        });

        decl.getGetAccessors().forEach(accessor => {
            const tsdoc = getTsdoc(this.#tsdocParser, accessor);
            const cp: ClassProperty = {
                name: accessor.getName(),
                summary: comment2String(tsdoc?.summarySection),
                remarks: comment2String(tsdoc?.remarksBlock?.content),
                type: this.getType(accessor),
                static: accessor.isStatic(),
                getter: true,
            };
            props.push(cp);
        });

        decl.getSetAccessors().forEach(accessor => {
            const p = props.find(p => p.name === accessor.getName());
            if (p) {
                p.setter = true;
                return;
            }

            const tsdoc = getTsdoc(this.#tsdocParser, accessor);
            const cp: ClassProperty = {
                name: accessor.getName(),
                summary: comment2String(tsdoc?.summarySection),
                remarks: comment2String(tsdoc?.remarksBlock?.content),
                type: this.getType(accessor),
                static: accessor.isStatic(),
            };
            props.push(cp);
        });

        return {
            kind: 'class',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            typeParams: decl.getTypeParameters().map(param => this.getTypeParam(param, tsdoc)),
            properties: props,
            methods: decl.getMethods().map(method => {
                const tsdoc = getTsdoc(this.#tsdocParser, method);
                const cm: ClassMethod = {
                    name: method.getName(),
                    summary: comment2String(tsdoc?.summarySection),
                    remarks: comment2String(tsdoc?.remarksBlock?.content),
                    type: this.getType(method),
                    typeParams: method.getTypeParameters().map(param => this.getTypeParam(param, tsdoc)),
                    params: method.getParameters().map(p => this.getParam(p, tsdoc)),
                    return: this.getReturnType(method.getReturnTypeNode(), tsdoc),
                    static: method.isStatic(),
                };
                return cm;
            }),
        };
    }

    private convFunction(decl: FunctionDeclaration): Type {
        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        return {
            kind: 'function',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            type: decl.getReturnType().getText(),
            typeParams: decl.getTypeParameters().map(param => this.getTypeParam(param, tsdoc)),
            params: decl.getParameters().map(p => this.getParam(p, tsdoc)),
            return: this.getReturnType(decl.getReturnTypeNode(), tsdoc),
        };
    }
}
