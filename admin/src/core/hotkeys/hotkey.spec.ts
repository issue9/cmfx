// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test, describe } from 'vitest';

import { Hotkey, modifierCodes } from './hotkey';

describe('HotKey', ()=>{
    test('construct',()=>{
        expect(()=>new Hotkey('F', 'shift', 'shift')).toThrowError('重复的修饰符 shift');

        let hk = new Hotkey('F', 'shift');
        expect((hk.key)).toEqual('f');
        expect((hk.modifiers)).toEqual(modifierCodes.get('shift'));

        hk = new Hotkey('F', 'shift', 'meta');
        expect((hk.key)).toEqual('f');
        expect((hk.modifiers)).toEqual(modifierCodes.get('shift')! + modifierCodes.get('meta')!);
    });
    
    test('match',()=>{
        const hk = new Hotkey('F', 'shift', 'meta');

        expect(hk.match(new KeyboardEvent('keydown', {key:'f', shiftKey: true, metaKey: true}))).toBeTruthy();
        expect(hk.match(new KeyboardEvent('keydown', {key:'F', shiftKey: true, metaKey: true}))).toBeTruthy();

        expect(hk.match(new KeyboardEvent('keydown', {key:'F', metaKey: true}))).toBeFalsy();
        expect(hk.match(new KeyboardEvent('keydown', {key:'f', shiftKey: true, metaKey: true, altKey: true}))).toBeFalsy();
    });

    test('toString',()=>{
        const hk = new Hotkey('F', 'shift', 'meta');
        expect(hk.toString()).toEqual('meta+shift+f');
    });
});