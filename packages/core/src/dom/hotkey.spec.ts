// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Hotkey, modifierCodes } from './hotkey';

describe('HotKey', ()=>{
    test('construct',()=>{
        expect(()=>new Hotkey('F', 'shift', 'shift')).toThrowError('重复的修饰符 shift');

        let hk = new Hotkey('F', 'shift');
        expect((hk.key)).toEqual('F');
        expect((hk.modifiers)).toEqual(modifierCodes.get('shift'));

        hk = new Hotkey('f', 'shift', 'meta');
        expect((hk.key)).toEqual('f');
        expect((hk.modifiers)).toEqual(modifierCodes.get('shift')! + modifierCodes.get('meta')!);
    });
    
    test('match',()=>{
        const hk = new Hotkey('F', 'shift', 'meta');

        expect(hk.match(new KeyboardEvent('keydown', {code:'KeyF', shiftKey: true, metaKey: true}))).toBeTruthy();

        expect(hk.match(new KeyboardEvent('keydown', {code:'KeyF', metaKey: true}))).toBeFalsy();
        expect(hk.match(new KeyboardEvent('keydown', {code:'KeyF', shiftKey: true, metaKey: true, altKey: true}))).toBeFalsy();
    });

    test('toString',()=>{
        const hk = new Hotkey('F', 'shift', 'meta');
        expect(hk.toString()).toEqual('meta+shift+F');
    });
});