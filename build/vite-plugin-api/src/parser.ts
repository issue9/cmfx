// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    DocCodeSpan, DocLinkTag, DocNode, DocParagraph, DocPlainText, DocSection,
    StandardTags, TSDocConfiguration, TSDocParser, TSDocTagDefinition, TSDocTagSyntaxKind
} from '@microsoft/tsdoc';
import path from 'node:path';
import {
    CallSignatureDeclaration, ConstructSignatureDeclaration, IndexSignatureDeclaration,
    ModuledNode, Node, Project, Type, TypeChecker, TypeElementTypes, TypeFormatFlags
} from 'ts-morph';

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
     * 如果是联合类型，此值用于表示具体的类型值。
     */
    type?: string;

    /**
     * 类型的字段列表，可能是 union 类型，没有字段。
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
    reactive: boolean;
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
    prorps(props: Array<string>): Array<Object> {
        const result: Array<Object> = [];

        for(const prop of props) {
            const decls = this.#exported.get(prop)?.filter(d =>
                Node.isInterfaceDeclaration(d) ||
                Node.isTypeAliasDeclaration(d) ||
                Node.isEnumDeclaration(d) ||
                Node.isClassDeclaration(d)
            );
            if (!decls || decls.length === 0) {
                throw new TypeError(`Type ${prop} not found`);
            }

            const decl = decls[0];

            const txt = decl.getJsDocs()[0]?.getFullText();
            const jsdoc = this.#parser.parseString(txt ?? '').docComment;
            const obj: Object = {
                name: decl.getName() ?? '',
                summary: comment2String(jsdoc.summarySection),
                remarks: comment2String(jsdoc.remarksBlock?.content),
            };

            const mem = this.buildFields(decl);
            if (typeof mem === 'string') {
                obj.type = mem;
            } else {
                obj.fields = mem;
            }

            result.push(obj);
        }

        return result;
    }

    /**
     * 生成类型字段列表
     */
    private buildFields(node: Node):Array<Field> | string | undefined {
        const mems = this.getNodeMember(node);

        if (typeof mems === 'string') { return mems; }

        return mems.map(f => {
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
     * 获取节点 node 的字段或是对应的类型
     */
    private getNodeMember(node: Node): Array<TypeElementTypes> | string {
        if (Node.isInterfaceDeclaration(node)) { // 如果本身是接口
            const props = node.getMembers();
            for(const b of node.getBaseTypes()) {
                props.push(...getTypeMember(b));
            }
            return props;
        }

        if (Node.isTypeAliasDeclaration(node)) { // 如果是类型别名
            const typ = this.#checker.getTypeAtLocation(node);

            // 右侧都是字面量组成的对象
            const lit = typ.isUnion() && typ.getUnionTypes().every(t => t.isLiteral())
                || typ.isIntersection() && typ.getIntersectionTypes().every(t => t.isLiteral());
            if (lit) {
                return typ.getText();
            }

            // 右侧不都是直接字面量（例如 type X = SomeOtherType），用类型检查器解析
            return getTypeMember(typ);
        }

        return [];
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

    if (node instanceof DocPlainText) {
        const txt = node.text.trim();
        return txt ? txt : undefined;
    }
    if (node instanceof DocCodeSpan) { return `\`${node.code}\``; }

    if (node instanceof DocLinkTag) {
        if (!node.linkText && !node.urlDestination) { return undefined; }
        return `[${node.linkText ?? node.urlDestination}](${node.urlDestination})`;
    }

    if (node instanceof DocParagraph || node instanceof DocSection) {
        const nodes = node.getChildNodes().map(comment2String).filter(v => !!v);
        return nodes.length > 0 ? nodes.join('') : undefined;
    }

    if ('getChildNodes' in node) {
        const nodes = node.getChildNodes().map(comment2String).filter(v => !!v);
        return nodes.length > 0 ? nodes.join('') : undefined;
    }
}
