// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { Extractor } from './extract';

describe('Extractor', { timeout: 20000 }, () => {
    const extractor = new Extractor();

    test('load', () => {
        extractor.load(path.resolve(__dirname, '../../../packages/components'));
        extractor.load(path.resolve(__dirname, '../../../packages/core'));
    });

    test('class', () => {
        const items = extractor.extract('@cmfx/core', 'index.d.ts', 'API');
        expect(items).length(1);

        const cls = items![0];
        expect(cls.kind).toEqual('class');
        if (cls.kind === 'class') {
            expect(cls.name).toEqual('API');
            expect(cls.summary?.trim()).toEqual('封装了访问后端接口的基本功能');
            expect(cls.remarks).toBeUndefined();

            const props = cls.properties!;
            expect(props.length > 0).toBe(true);

            const baseURL = props.find(p => p.name === 'baseURL')!;
            expect(baseURL.name).toEqual('baseURL');
            expect(baseURL.type).toEqual('string');
            expect(baseURL.summary?.trim()).toEqual('当前对象访问 API 是的基地址');
            expect(baseURL.remarks).toBeUndefined();
            expect(baseURL.static).toBeFalsy();

            const errcode = props.find(p => p.name === 'ErrorCode')!;
            expect(errcode.name).toEqual('ErrorCode');
            expect(errcode.type).toEqual('418');
            expect(errcode.def).toEqual('418');
            expect(errcode.summary?.trim()).toEqual('当前客户端发生的一些非预料错误时的错误代码');
            expect(errcode.remarks).toBeDefined();
            expect(errcode.static).toBe(true);

            //-------------------- method

            const methods = cls.methods;
            expect(methods!.length > 0).toBe(true);

            const cache = methods?.find(m => m.name === 'cache');
            expect(cache?.typeParams).length(0);
            expect(cache).toBeDefined();
            expect(cache?.name).toEqual('cache');
            expect(cache?.summary?.trim()).toEqual('缓存 path 指向的 GET 接口数据');
            expect(cache?.remarks).toBeDefined();
            expect(cache?.params).length(2);
            expect(cache?.static).toBeFalsy();

            const post = methods?.find(m => m.name === 'post');
            expect(post).toBeDefined();
            expect(post?.name).toEqual('post');
            expect(post?.summary).toBeUndefined();
            expect(post?.remarks).toBeUndefined();
            expect(post?.return.type).toEqual('Promise<Return<R, PE>>');
            expect(post?.params).length(4);
            expect(post?.typeParams).length(2);
            expect(post?.typeParams![0].name).toEqual('R');
            expect(post?.typeParams![1].name).toEqual('PE');
        }
    });

    test('interface', () => {
        const items = extractor.extract('@cmfx/components', 'index.d.ts', 'BaseProps');
        expect(items).length(1);

        const intf = items![0];
        expect(intf.kind).toEqual('interface');

        if (intf.kind === 'interface') {
            expect(intf.name).toEqual('BaseProps');
            expect(intf.summary?.trim()).toEqual('组件的基本属性');
            expect(intf.remarks?.trim()).toEqual('组件库的所有组件都继承了此接口，以实现统一的样式管理。');

            expect(intf.properties).length(3);

            const p0 = intf.properties![0];
            expect(p0.name).toEqual('palette');
            expect(p0.type).toEqual('"primary" | "secondary" | "tertiary" | "error" | "surface" | undefined');
            expect(p0.summary?.trim()).toEqual('指定当前组件采用的色盘');
            expect(p0.remarks).toBeDefined();

            const p1 = intf.properties![1];
            expect(p1.name).toEqual('class');
            expect(p1.type).toEqual('string | undefined');
            expect(p1.summary?.trim()).toEqual('为组件的根元素指定 CSS 类名');
            expect(p1.remarks).toBeDefined();

            const p2 = intf.properties![2];
            expect(p2.name).toEqual('style');
            expect(p2.type).toEqual('string | JSX.CSSProperties | undefined');
            expect(p2.summary?.trim()).toEqual('组件根元素的样式');
            expect(p2.remarks).toBeDefined();
        }
    });

    test('generic interface', () => {
        const items = extractor.extract('@cmfx/core', 'index.d.ts', 'Column');
        expect(items).length(1);

        const intf = items![0];
        expect(intf.kind).toEqual('interface');

        if (intf.kind === 'interface') {
            expect(intf.name).toEqual('Column');
            expect(intf.summary?.trim()).toEqual('定义导出列的相关信息');
            expect(intf.remarks).toBeUndefined();

            expect(intf.typeParams).length(1);
            expect(intf.typeParams![0].name).toEqual('T');
            expect(intf.typeParams![0].summary?.trim()).toEqual('导出数据中每行数据的类型');
            expect(intf.typeParams![0].type).toEqual('object');
        }
    });

    test('interface with generic method', () => {
        const items = extractor.extract('@cmfx/core', 'index.d.ts', 'REST');
        expect(items).length(1);

        const intf = items![0];
        expect(intf.kind).toEqual('interface');

        if (intf.kind === 'interface') {
            expect(intf.name).toEqual('REST');
            expect(intf.summary?.trim()).toEqual('RESTful 接口的基本操作方法');
            expect(intf.remarks).toBeUndefined();
            expect(intf.typeParams).length(0);

            expect(intf.methods).length(8);
            const del = intf.methods?.find(m => m.name === 'delete');
            expect(del).toBeDefined();
            expect(del?.params).length(3);
            expect(del?.typeParams).length(2);
            expect(del?.typeParams![0].name).toEqual('R');
            expect(del?.typeParams![0].summary).toBeUndefined();
            expect(del?.typeParams![0].type).toEqual('any');
            expect(del?.typeParams![0].init).toEqual('never');

            expect(del?.typeParams![1].name).toEqual('PE');
            expect(del?.typeParams![1].summary).toBeUndefined();
            expect(del?.typeParams![1].type).toEqual('any');
            expect(del?.typeParams![1].init).toEqual('never');
        }
    });

    test('alias', () => {
        const items = extractor.extract('@cmfx/components', 'index.d.ts', 'ButtonKind');
        expect(items).length(1);

        const alias = items![0];
        expect(alias.kind).toEqual('alias');

        if (alias.kind === 'alias') {
            expect(alias.name).toEqual('ButtonKind');
            expect(alias.summary?.trim()).toEqual('组件的风格');
            expect(alias.remarks).toBeDefined();
            expect(alias.type).toEqual('flat | border | fill');
        }
    });

    test('function', () => {
        const items = extractor.extract('@cmfx/components', 'index.d.ts', 'joinClass');
        expect(items).length(1);

        const f = items![0];
        expect(f.name).toEqual('joinClass');
        expect(f.kind).toEqual('function');

        if (f.kind === 'function') {
            expect(f.return).toBeDefined();
            expect(f.return.type).toEqual('string | undefined');
            expect(f.return.summary?.trim()).toEqual('由参数组合的 class 属性值；');

            const ps = f.params!;
            expect(ps).length(2);
            expect(ps[0].name).toEqual('palette');
            expect(ps[0].type).toEqual('"primary" | "secondary" | "tertiary" | "error" | "surface" | undefined');
            expect(ps[0].summary?.trim()).toEqual('颜色主题；');
            expect(ps[1].name).toEqual('cls');
            expect(ps[1].type).toEqual('(string | null | undefined)[]');
            expect(ps[1].summary?.trim()).toEqual('CSS 类名列表；');
        }
    });
});
