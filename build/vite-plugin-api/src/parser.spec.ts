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
        expect(pp.doc).not.toBeUndefined();
        expect(pp.remarks).not.toBeUndefined();

        expect(pp.fields).toHaveLength(2);
        const f1 = pp.fields![0];
        expect(f1.name).toEqual('palette');
        expect(f1.type).toContain('secondary');
        expect(f1.reactive).toBe(true);
        expect(f1.preset).toBeUndefined();
        expect(f1.doc).not.toBeUndefined();
        expect(f1.remarks).not.toBeUndefined();
    });

    test('BadgeCorner', () => {
        const props = p.prorps(['BadgeCorner']); // type xx = enum...
        expect(props).toHaveLength(1);
        const pp = props[0];
        expect(pp.name).toEqual('BadgeCorner');
        expect(pp.doc).toBeFalsy();
        expect(pp.remarks).toBeFalsy();
    });

    // CodeProps extends BaseProps
    test('CodeProps', () => {
        const props = p.prorps(['CodeProps']);
        expect(props).toHaveLength(1);

        const pp = props[0];
        expect(pp.name).toEqual('CodeProps');
        expect(pp.doc).toBeUndefined();
        expect(pp.remarks).toBeUndefined();

        expect(pp.fields).toHaveLength(8);
        const f1 = pp.fields?.filter(v => v.name === 'palette');
        expect(f1).not.toBeUndefined();
    });
});
