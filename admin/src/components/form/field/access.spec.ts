// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { FieldAccessor } from './access';

test('field access', () => {
    const a = FieldAccessor('name', 5);

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
