// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { fieldAccessor } from './access';

describe('fieldAccessor', () => {
    test('value', () => {
        const a = fieldAccessor('name', 5);

        expect(a.getError()).toBeUndefined();
        expect(a.getValue()).toEqual<number>(5);

        a.setError('error');
        expect(a.getError()).toEqual<string>('error');

        a.setValue(7);
        expect(a.getValue()).toEqual<number>(7);
        expect(a.getError()).toEqual<string>('error');
        a.setError('error');

        a.reset();
        expect(a.getValue()).toEqual<number>(5);
        expect(a.getError()).toBeUndefined();

        a.setValue(7);
    });

    test('signal', () => {
        const a = fieldAccessor('name', createSignal(5));

        expect(a.getError()).toBeUndefined();
        expect(a.getValue()).toEqual<number>(5);

        a.setError('error');
        expect(a.getError()).toEqual<string>('error');

        a.setValue(7);
        expect(a.getValue()).toEqual<number>(7);
        expect(a.getError()).toEqual<string>('error');
        a.setError('error');

        a.reset();
        expect(a.getValue()).toEqual<number>(5);
        expect(a.getError()).toBeUndefined();

        a.setValue(7);
    });
});
