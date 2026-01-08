// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Class, conv, Function, Interface, TypeAlias, Variable } from './conv';
import { Extractor } from './extract';

describe('conv', () => {
    const extractor = new Extractor();
    extractor.load('../../../packages/components');
    extractor.load('../../../packages/core');

    test('class', () => {
        const items = extractor.extract('@cmfx/core', 'index', 'API');
        expect(items).length(1);

        const cls = conv(items![0]) as Class;
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
        expect(errcode.type).toEqual(''); // 没有明确的类型声明
        expect(errcode.init).toEqual('418');
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
        expect(cache?.parameters).length(2);
        expect(cache?.static).toBeFalsy();

        const post = methods?.find(m => m.name === 'post');
        expect(post).toBeDefined();
        expect(post?.name).toEqual('post');
        expect(post?.summary).toBeUndefined();
        expect(post?.remarks).toBeUndefined();
        expect(post?.return.type).toEqual('Promise<Return<R, PE>>');
        expect(post?.parameters).length(4);
        expect(post?.typeParams).length(2);
        expect(post?.typeParams![0].name).toEqual('R');
        expect(post?.typeParams![1].name).toEqual('PE');
    });

    test('interface', () => {
        const items = extractor.extract('@cmfx/components', 'index.d.ts', 'BaseProps');
        expect(items).length(1);

        const intf = conv(items![0]) as Interface;

        expect(intf.name).toEqual('BaseProps');
        expect(intf.summary?.trim()).toEqual('组件的基本属性');
        expect(intf.remarks?.trim()).toEqual('组件库的所有组件都继承了此接口，以实现统一的样式管理。');

        expect(intf.properties).length(3);

        const p0 = intf.properties![1];
        expect(p0.name).toEqual('palette');
        expect(p0.type).toEqual('Palette');
        expect(p0.summary?.trim()).toEqual('指定当前组件采用的色盘');
        expect(p0.remarks).toBeDefined();

        const p1 = intf.properties![0];
        expect(p1.name).toEqual('class');
        expect(p1.type).toEqual('string');
        expect(p1.summary?.trim()).toEqual('为组件的根元素指定 CSS 类名');
        expect(p1.remarks).toBeDefined();

        const p2 = intf.properties![2];
        expect(p2.name).toEqual('style');
        expect(p2.type).toEqual('JSX.DOMAttributes<HTMLElement>[\'style\']');
        expect(p2.summary?.trim()).toEqual('组件根元素的样式');
        expect(p2.remarks).toBeDefined();
    });

    test('variable', () => {
        const items = extractor.extract('@cmfx/components', '', 'buttonKinds');
        expect(items).length(1);

        const variable = conv(items![0]) as Variable;
        expect(variable.name).toEqual('buttonKinds');
        expect(variable.summary).toBeUndefined();
        expect(variable.remarks).toBeUndefined();
    });

    test('typeAlias', () => {
        const items = extractor.extract('@cmfx/components', '', 'ButtonKind');
        expect(items).length(1);

        const alias = conv(items![0]) as TypeAlias;
        expect(alias.name).toEqual('ButtonKind');
        expect(alias.summary?.trim()).toEqual('组件的风格');
        expect(alias.remarks).toBeDefined();
        expect(alias.type).toEqual('typeof buttonKinds[number]');
    });

    test('function', () => {
        const items = extractor.extract('@cmfx/components', '', 'joinClass');
        expect(items).length(1);

        const f = conv(items![0]) as Function;
        expect(f.name).toEqual('joinClass');

        expect(f.return).toBeDefined();
        expect(f.return.type).toEqual('string | undefined');
        expect(f.return.summary?.trim()).toEqual('由参数组合的 class 属性值；');

        const ps = f.parameters;
        expect(ps).length(2);
        expect(ps[0].name).toEqual('palette');
        expect(ps[0].type).toEqual('Palette');
        expect(ps[0].summary?.trim()).toEqual('颜色主题；');
        expect(ps[1].name).toEqual('cls');
        expect(ps[1].type).toEqual('Array<string | undefined | null>');
        expect(ps[1].summary?.trim()).toEqual('CSS 类名列表；');
    });
});
