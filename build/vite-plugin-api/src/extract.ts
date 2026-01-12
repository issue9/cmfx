// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
    ClassDeclaration, ExportedDeclarations, FunctionDeclaration, InterfaceDeclaration, ModuledNode, Node,
    ParameterDeclaration, Project, TypeAliasDeclaration, TypeChecker, TypeNode, TypeParameterDeclaration
} from 'ts-morph';

import { DocComment, StandardTags } from '@microsoft/tsdoc';
import {
    comment2String, getCustomDoc, getTsdoc, newTSDocParser, reactiveTag
} from './tsdoc';
import {
    Alias, ClassMethod, ClassProperty, InterfaceMethod, InterfaceProperty, Parameter, ReturnType as RT, Type, TypeParameter
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

    private conv(decl: ExportedDeclarations, chk: TypeChecker): Type {
        if (Node.isInterfaceDeclaration(decl)) {
            return this.convInterface(decl);
        } else if (Node.isClassDeclaration(decl)) {
            return this.convClass(decl);
        } else if (Node.isFunctionDeclaration(decl)) {
            return this.convFunction(decl);
        } else if (Node.isTypeAliasDeclaration(decl)) {
            return this.convAlias(decl, chk);
        }

        throw new Error(`不支持的类型 ${decl.getKindName()}`);
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
        const tsdoc = getTsdoc(this.#tsdocParser, decl);

        const alias: Alias = {
            kind: 'alias',
            name: decl.getName() ?? '',
            summary: comment2String(tsdoc?.summarySection),
            remarks: comment2String(tsdoc?.remarksBlock?.content),
            type: '', // 占位，后续获取真实的值。
        };

        const typ = chk.getTypeAtLocation(decl).getApparentType();
        if (typ.isUnion()) {
            alias.type = typ.getUnionTypes().map(t => {
                return t.isLiteral() ? t.getLiteralValue() : t.getText();
            }).join(' | ');
        } else if (typ.isIntersection()) {
            alias.type = typ.getIntersectionTypes().map(t => {
                return t.isLiteral() ? t.getLiteralValue() : t.getText();
            }).join(' & ');
        } else { // 其它情况应该只有一个 declarations
            alias.type = typ.getText();
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
