// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';
import { Locales } from './locales';

describe('Locales', () => {
    test('constructor', () => {
        expect(() => {
            new Locales([], 0);
        }).toThrowError('supported 不能为空');

        const l = new Locales(['zh', 'en'], 1, 'zh')
        expect(l).not.toBeNull();
        expect(l.fallback).toEqual('en');
        expect(l.current).toEqual('zh');
        expect(l.supported).length(2);

        expect(new Locales(['und'], 0, 'zh')).not.toBeNull();

        // 空的 curr，最终必然是匹配到一个元素的。
        expect(new Locales(['zh'], 0)).not.toBeNull();
    });

    test('current', () => {
        const l = new Locales(['zh', 'jp'], 0, 'cmn');
        expect(l.current, 'zh');

        l.current = 'jp';
        expect(l.current, 'jp');

        l.current = 'ca';
        expect(l.current).toEqual('zh');
    });

    test('afterChange', () => {
        let l = new Locales(['zh', 'jp'], 1, 'cmn');
        l.afterChange((m, o, old, f) => {
            expect(old).toEqual('zh');
            expect(m).toEqual('zh');
            expect(o).toEqual('zh');
            expect(f).toEqual('jp');
        });
        l.current = 'zh';

        l = new Locales(['zh', 'jp'], 1, 'cmn');
        l.afterChange((m, o, old, f) => {
            expect(old).toEqual('zh');
            expect(m).toEqual('zh');
            expect(o).toEqual('cmn');
            expect(f).toEqual('jp');
        });
        l.current = 'cmn';
    });

    test('supportedNames', () => {
        const l = new Locales(['zh', 'jp'], 0, 'zh');

        const names = l.supportedNames();
        expect(names).length(2);
        expect(names.get('zh')).not.length(0);
        expect(names.get('jp')).not.length(0);
    });
});
