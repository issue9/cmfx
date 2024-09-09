// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';
import { Breakpoints } from './breakpoints';

test('breakpoints.compare', () => {
    expect(Breakpoints.compare('xs', 'sm')).toEqual(-1);
    expect(Breakpoints.compare('sm', 'sm')).toEqual(0);
    expect(Breakpoints.compare('sm', 'xs')).toEqual(1);
    expect(Breakpoints.compare('sm', 'lg')).toEqual(-2);

    const bp = new Breakpoints();
    bp.onChange(() => {
        // TODO
    });
});
