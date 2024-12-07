// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 支持的修饰符
 */
export type Modifier = 'meta' | 'alt' | 'control' | 'shift';

export type Modifiers = [Modifier, ...Modifier[]];

export const modifierCodes: ReadonlyMap<Modifier, number> = new Map<Modifier,number>([
    ['meta', 1],
    ['alt', 2],
    ['control', 4],
    ['shift', 8],
]);

export class Hotkey {
    readonly key: string;
    readonly modifiers: number;

    constructor(key: string, ...modifiers: Modifiers) {
        modifiers = modifiers.sort();
        for (let i = 0;i<modifiers.length; i++) {
            if (modifiers[i] === modifiers[i+1]) {
                throw `重复的修饰符 ${modifiers[i]}`;
            }
        }

        let code = 0;
        for(const m of modifiers) {
            code += modifierCodes.get(m)!;
        }
        this.key = key.toLocaleLowerCase();
        this.modifiers = code;
    }

    /**
     * 判断事件 e 的按键是否与当前匹配
     */
    match(e: KeyboardEvent): boolean {
        if (e.key.toLocaleLowerCase() !== this.key) {return false;}
            
        let count = 0;
        if (e.metaKey) {count +=1;}
        if (e.altKey) {count +=2;}
        if (e.ctrlKey) {count +=4;}
        if (e.shiftKey) {count +=8;}
        return count === this.modifiers;
    }
}
