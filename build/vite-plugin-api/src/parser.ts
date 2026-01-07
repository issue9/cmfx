// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    DocCodeSpan, DocLinkTag, DocMemberReference, DocNode, DocPlainText,
    StandardTags, TSDocConfiguration, TSDocParser, TSDocTagDefinition, TSDocTagSyntaxKind
} from '@microsoft/tsdoc';
import path from 'node:path';
import {
    CallSignatureDeclaration, ConstructSignatureDeclaration, FunctionDeclaration, FunctionExpression,
    IndexSignatureDeclaration, ModuledNode, Node, Project, Type, TypeChecker, TypeElementTypes, TypeFormatFlags
} from 'ts-morph';
import ts from 'typescript';

const reactiveTag = '@reactive';
const defaultTag = '@default';

/**
 * 类型的文档对象
 */
export interface Object {
    /**
     * 类型名称
     */
    name: string;

    /**
     * 对应在的文档
     */
    summary?: string;

    /**
     * 备注信息
     */
    remarks?: string;

    /**
     * 如果是联合类型或是其它不用解析的类型，此值用于表示具体的类型值。
     *
     * @remarks 如果是函数类型，type 与 {@link fields} 都不为空，其它情况下两者必有一个为空。
     */
    type?: string;

    /**
     * 类型的字段列表或是参数列表
     */
    fields?: Array<Field>;
}

/**
 * 类型的字段对象
 */
export interface Field {
    /**
     * 字段名称
     */
    name: string;

    /**
     * 对应在的文档
     */
    summary?: string;

    /**
     * 字段的备注信息
     */
    remarks?: string;

    /**
     * 类型名称
     */
    type: string;

    /**
     * 默认值
     *
     * 如果是 undefined，则表示文档中没有明确指定。
     */
    preset?: string;

    /**
     * 是否为响应式字段
     */
    reactive?: boolean;
}

/**
 * 代码解析器，用于提取 API 文档。
 */
export class Parser {
    #exported: ReturnType<ModuledNode['getExportedDeclarations']>;
    #checker: TypeChecker;

    #parser: TSDocParser;

    constructor(root: string) {
        const tsconfig = path.join(root, 'tsconfig.json');
        const project = new Project({
            tsConfigFilePath: tsconfig,
            skipAddingFilesFromTsConfig: true
        });

        const outdir = project.compilerOptions.get().outDir ?? path.join(root, 'lib');
        const dts = project.addSourceFileAtPath(path.join(outdir, 'index.d.ts'));
        this.#exported = dts.getExportedDeclarations();
        this.#checker = project.getTypeChecker();

        /****************** 以下定义 TSDocParser ************************/

        const reactiveTagDef = new TSDocTagDefinition({
            tagName: reactiveTag,
            syntaxKind: TSDocTagSyntaxKind.ModifierTag
        });

        const defaultTagDef = new TSDocTagDefinition({
            tagName: defaultTag,
            syntaxKind: TSDocTagSyntaxKind.BlockTag
        });

        const conf = new TSDocConfiguration();

        conf.addTagDefinition(reactiveTagDef);
        conf.setSupportForTag(reactiveTagDef, true);

        conf.addTagDefinition(defaultTagDef);
        conf.setSupportForTag(defaultTagDef, true);

        conf.addTagDefinition(StandardTags.defaultValue);
        conf.setSupportForTag(StandardTags.defaultValue, true);

        this.#parser = new TSDocParser(conf);
    }

    /**
     * 查找指定类型的文档描述
     */
    props(props: Array<string>): Array<Object> {
        const result: Array<Object> = [];

        for(const prop of props) {
            const decls = this.#exported.get(prop)?.filter(d =>
                Node.isInterfaceDeclaration(d) ||
                Node.isTypeAliasDeclaration(d) ||
                Node.isEnumDeclaration(d) ||
                Node.isClassDeclaration(d) ||
                Node.isFunctionDeclaration(d) ||
                Node.isFunctionExpression(d)
            );
            if (!decls || decls.length === 0) {
                throw new TypeError(`Type ${prop} not found`);
            }

            const decl = decls[0];

            const txt = decl.getJsDocs()[0]?.getFullText();
            const jsdoc = this.#parser.parseString(txt ?? '').docComment;
            const obj: Object = {
                //name: decl.getName() ?? '',
                name: prop,
                summary: comment2String(jsdoc.summarySection),
                remarks: comment2String(jsdoc.remarksBlock?.content),
            };
            this.buildNodeType(obj, decl);

            result.push(obj);
        }

        return result;
    }

    /**
     * 生成类型字段列表或是对应的类型名称
     */
    private buildNodeType(obj: Object, node: Node): void {
        if (Node.isFunctionDeclaration(node) || Node.isFunctionExpression(node)) { // 函数
            obj.type = node.getText().replace(/export\s*declare\s*/, '');
            this.getMethodParams(obj, node);
            return;
        }

        const mems = this.getNodeType(obj, node);

        if (!mems) { return; }

        if (typeof mems === 'string') {
            obj.type = mems;
            return;
        }

        obj.fields = mems.map(f => {
            const ftxt = f.getJsDocs()[0]?.getFullText();
            const fdoc = this.#parser.parseString(ftxt ?? '').docComment;

            let preset: string | undefined = undefined;
            let reactive: boolean = false;
            if (fdoc) {
                fdoc.customBlocks.forEach(blk => {
                    if (blk.blockTag.tagName === StandardTags.defaultValue.tagName
                        || blk.blockTag.tagName === defaultTag) {
                        preset = comment2String(blk);
                    }
                });
                reactive = fdoc.modifierTagSet.hasTagName(reactiveTag);
            }

            if (f instanceof ConstructSignatureDeclaration
                || f instanceof CallSignatureDeclaration
                || f instanceof IndexSignatureDeclaration) {
                return undefined;
            }

            return {
                name: f.getName(),
                summary: comment2String(fdoc.summarySection),
                remarks: comment2String(fdoc.remarksBlock?.content),
                type: f.getType().getText(f, TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
                preset,
                reactive
            } as Field;
        }).filter(v => !!v);
    }

    /**
     * 获取节点 node 类型为方法的所有参数列表并写入 Obj.fields 中
     */
    private getMethodParams(obj: Object, node: FunctionDeclaration | FunctionExpression): void {
        const params = node.getParameters();
        if (!obj.fields) { obj.fields = []; }

        const jsdoc = node.getJsDocs();
        const doc = this.#parser.parseString(jsdoc ? jsdoc[0].getFullText() : '').docComment;

        for (const param of params) {
            const paramDoc = doc.params.blocks.find(p => param.getName() === p.parameterName);
            const init = param.getInitializer();
            obj.fields.push({
                name: param.getName(),
                summary: paramDoc ? comment2String(paramDoc.content) : '',
                type: param?.getType().getText(param, TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)!,
                preset: init ? init.getText() : undefined,
            });
        }
    }

    /**
     * 获取节点 node 的类型字段或是对应的类型名称
     */
    private getNodeType(obj: Object, node?: Node): Array<TypeElementTypes> | string | undefined {
        if (!node) { return; }

        if (Node.isInterfaceDeclaration(node)) { // 接口
            const props = node.getMembers();
            for (const b of node.getBaseTypes()) {
                props.push(...getTypeMember(b));
            }
            return props;
        }

        if (Node.isTypeAliasDeclaration(node)) { // 类型别名
            const typ = this.#checker.getTypeAtLocation(node).getApparentType();
            return this.getAliasType(typ, node, obj);
        }
    }

    /**
     * 获取类型别名的真实类型 typ 的字段或是类型声明
     */
    private getAliasType(typ: Type, node: Node, obj: Object): Array<TypeElementTypes> | string | undefined {
        if (typ.getCallSignatures().length > 0) { // 函数
            this.getMethodParams(obj, node as FunctionDeclaration | FunctionExpression);
            return;
        }

        // 判断 t 是否为标准库的类型
        const isStd = (t: Node<ts.Node>): boolean => {
            const sourceFile = t.getSourceFile();
            return sourceFile.getFilePath().includes('typescript/lib/lib.');
        };

        // 判断 t 是否为第三方包中的类型
        const isModules = (t: Node<ts.Node>): boolean => {
            const sourceFile = t.getSourceFile();
            return sourceFile.getFilePath().includes('node_modules/');
        };

        if (typ.getSymbol()?.getDeclarations().every(isStd) // 标准库
            || typ.getSymbol()?.getDeclarations().every(isModules)) { // 第三方库
            return typ.getText();
        } else if (typ.isUnion() && typ.getUnionTypes().every(t => t.isLiteral())) {
            return typ.getUnionTypes().map(t => t.getLiteralValue()).join(' | ');
        } else if (typ.isIntersection() && typ.getIntersectionTypes().every(t => t.isLiteral())) {
            return typ.getIntersectionTypes().map(t => t.getLiteralValue()).join(' & ');
        }

        return getTypeMember(typ);
    }
}

/**
 * 获取类型 typ 的所有成员
 */
function getTypeMember(typ: Type): Array<TypeElementTypes> {
    const props = typ.getProperties()
        .map(sym => {
            const decl = sym.getDeclarations()?.[0];
            return Node.isTypeElement(decl) ? decl : undefined;
        })
        .filter((p): p is TypeElementTypes => !!p);

    const bases = typ.getBaseTypes();
    for(const b of bases) {
        const baseProps = getTypeMember(b);
        props.push(...baseProps);
    }

    return props;
}

function comment2String(node?: DocNode): string | undefined {
    if (!node) { return undefined; }

    if (node instanceof DocPlainText) { return node.text.trim(); }

    if (node instanceof DocCodeSpan) { return `\`${node.code}\``; }

    if (node instanceof DocMemberReference) { return node.memberIdentifier?.identifier; }

    if (node instanceof DocLinkTag) {
        if (node.linkText) { // url
            return `[${node.linkText}](${node.urlDestination ?? node.linkText})`;
        }

        // 文档内链接，直接返回文本，链接在当前并无实际意义
        const nodes = node.getChildNodes().map(comment2String).filter(v => !!v);
        return nodes.length > 0 ? '`' + nodes.join('').trim() + '`' : undefined;
    }

    const nodes = node.getChildNodes().map(comment2String).filter(v => !!v);
    if (nodes.length <= 0) { return undefined; }
    const s = nodes.join('\n');
    return s.endsWith('\n\n') ? s : s + '\n\n'; // 防止过多的换行符
}
