// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Parser } from './parser';

describe('Parser', {timeout: 20000}, () => {
    const p = new Parser('./packages/components'); // 相对根目录

    test('BaseProps', () => {
        const props = p.prorps(['BaseProps']);
        expect(props).toHaveLength(1);

        const pp = props[0];
        expect(pp.name).toEqual('BaseProps');
        expect(pp.summary).not.toBeUndefined();
        expect(pp.remarks).not.toBeUndefined();

        expect(pp.fields).toHaveLength(2);
        const f1 = pp.fields![0];
        expect(f1.name).toEqual('palette');
        expect(f1.type).toContain('secondary');
        expect(f1.reactive).toBe(true);
        expect(f1.preset).toBeUndefined();
        expect(f1.summary).not.toBeUndefined();
        expect(f1.remarks).not.toBeUndefined();

        const f2 = pp.fields![1];
        expect(f2.name).toEqual('class');
        expect(f2.type).toContain('string');
        expect(f2.reactive).toBe(true);
        expect(f2.preset).toEqual('undefined');
        expect(f2.summary).not.toBeUndefined();
        expect(f2.remarks).not.toBeUndefined();
    });

    // 枚举：type xx = ...
    test('BadgeCorner', () => {
        const props = p.prorps(['BadgeCorner']);
        expect(props).toHaveLength(1);
        const pp = props[0];
        expect(pp.name).toEqual('BadgeCorner');
        expect(pp.summary).toBeFalsy();
        expect(pp.remarks).toBeFalsy();
        expect(pp.fields).toBeUndefined();
        expect(pp.type).toContain('left');
    });

    // 继承：CodeProps extends BaseProps
    test('CodeProps', () => {
        const props = p.prorps(['CodeProps']);
        expect(props).toHaveLength(1);

        const pp = props[0];
        expect(pp.name).toEqual('CodeProps');
        expect(pp.summary).toBeUndefined();
        expect(pp.remarks).toBeUndefined();

        expect(pp.fields).toHaveLength(8);
        const f1 = pp.fields?.filter(v => v.name === 'palette')[0];
        expect(f1).not.toBeUndefined();
    });

    // 泛型：DividerProps extends ParentProps<...>
    test('DividerProps', () => {
        const props = p.prorps(['DividerProps']);
        expect(props).toHaveLength(1);

        const pp = props[0];
        expect(pp.name).toEqual('DividerProps');
        expect(pp.summary).toBeUndefined();
        expect(pp.remarks).toBeUndefined();

        expect(pp.fields).toHaveLength(6);
        const f1 = pp.fields?.filter(v => v.name === 'palette')[0];
        expect(f1).not.toBeUndefined();

        const f2 = pp.fields?.filter(v => v.name === 'children')[0];
        expect(f2).not.toBeUndefined();
    });

    // 默认值 @defaultValue
    test('TooltipProps', () => {
        const props = p.prorps(['TooltipProps']);
        expect(props).toHaveLength(1);

        const pp = props[0];
        expect(pp.name).toEqual('TooltipProps');

        expect(pp.fields).toHaveLength(5);
        const f1 = pp.fields?.filter(v => v.name === 'stays')[0];
        expect(f1).not.toBeUndefined();
        expect(f1?.preset).not.toBeUndefined();
    });

    // ButtonRef = HTMLButtonElement，引用了标准库的，不应该解析字段
    test('ButtonRef', () => {
        const props = p.prorps(['ButtonRef']);
        expect(props).toHaveLength(1);

        const pp = props[0];
        expect(pp.name).toEqual('ButtonRef');

        expect(pp.fields).toBeFalsy();
        expect(pp.type).toEqual('HTMLButtonElement');
    });
});
