// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';
import {Locales} from './locales';

describe('Locales', ()=> {
    test('constructor', () => {
        expect(() => {
            new Locales([]);
        }).toThrowError('supported 不能为空');

        expect(() => {
            new Locales(['und'], 'zh');
        }).toThrowError('curr 必须位于 supported 中');

        expect(new Locales(['zh'], 'zh')).not.toBeNull();

        // 空的 curr，最终必然是匹配到一个元素的。
        expect(new Locales(['zh'])).not.toBeNull();
    });
    
    test('current', ()=>{
        const l = new Locales(['zh', 'jp'], 'zh');
        expect(l.current, 'zh');
        
        l.current = 'jp';
        expect(l.current, 'jp');
        
        expect(()=>{l.current = 'ca';}).toThrowError('不支持该语言');
    });
    
    test('supportedNames',()=>{
        const l = new Locales(['zh', 'jp'], 'zh');
        
        const names = l.supportedNames();
        expect(names).length(2);
        expect(names.get('zh')).not.length(0);
        expect(names.get('jp')).not.length(0);
    });
});