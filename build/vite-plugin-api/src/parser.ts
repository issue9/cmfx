// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    DocCodeSpan, DocLinkTag, DocNode, DocParagraph, DocPlainText, DocSection, TSDocParser
} from '@microsoft/tsdoc';
import path from 'node:path';
import { ModuledNode, Node, Project, PropertySignature, Type, TypeChecker } from 'ts-morph';

interface Object {
    name: string;
    doc?: string;
    remarks?: string;
    fields?: Array<Field>;
}

interface Field {
    name: string;
    doc?: string;
    remarks?: string;
    type?: string;
    preset?: string;
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

        this.#parser = new TSDocParser();
    }

    /**
     * 查找指定名称的类并返回对应的文档
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
            if (!decls || decls.length === 0) { continue; } // TODO 错误信息

            const decl = decls[0];
            const fields = this.getNodePropertySignatures(decl);

            const txt = decl.getJsDocs()[0]?.getFullText();
            const jsdoc = this.#parser.parseString(txt ?? '').docComment;
            result.push({
                name: decl.getName() ?? '',
                doc: comment2String(jsdoc.summarySection),
                remarks: comment2String(jsdoc.remarksBlock?.content),
                fields: fields.map(f => {
                    const ftxt = f.getJsDocs()[0]?.getFullText();
                    const fdoc = this.#parser.parseString(ftxt ?? '').docComment;

                    let preset: string | undefined = undefined;
                    let reactive = true;
                    if (fdoc) {
                        fdoc.customBlocks.forEach(blk => {
                            switch (blk.blockTag.tagName) {
                            case '@defaultValue':
                            case '@default':
                                preset = comment2String(blk);
                                preset = preset === 'undefined' ? undefined : preset;
                                break;
                            case '@noReactive':
                                reactive = false;
                                break;
                            }
                        });
                    }

                    return {
                        name: f.getName(),
                        doc: comment2String(fdoc.summarySection),
                        remarks: comment2String(fdoc.remarksBlock?.content),
                        type: f.getType().getText(),
                        preset,
                        reactive
                    };
                }),
            });
        }
        return result;
    }

    private getNodePropertySignatures(node: Node): Array<PropertySignature> {
        if (Node.isInterfaceDeclaration(node)) { // 如果本身是接口
            const props = node.getProperties();
            for(const b of node.getBaseTypes()) {
                props.push(...getTypePropertySignatures(b));
            }
            return props;
        }

        if (Node.isTypeAliasDeclaration(node)) { // 如果是类型别名，且右侧是对象字面量类型
            const typeNode = node.getTypeNode();
            if (typeNode && Node.isTypeLiteral(typeNode)) {
                return typeNode.getProperties();
            }

            // 如果不是直接字面量（例如 type X = SomeOtherType），用类型检查器解析
            const type = this.#checker.getTypeAtLocation(node);

            return getTypePropertySignatures(type);
        }

        return [];
    }
}

function getTypePropertySignatures(typ: Type): Array<PropertySignature> {
    const props = typ.getProperties()
        .map(sym => {
            const decl = sym.getDeclarations()?.[0];
            return Node.isPropertySignature(decl) ? decl : undefined;
        })
        .filter((p): p is PropertySignature => !!p);

    const bases = typ.getBaseTypes();
    for(const b of bases) {
        const baseProps = getTypePropertySignatures(b);
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
