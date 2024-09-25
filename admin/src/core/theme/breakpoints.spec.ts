// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';
import { breakpoints, breakpointsMedia, compareBreakpoint } from './breakpoints';

test('compareBreakpoint', () => {
    expect(compareBreakpoint('xs', 'sm')).toEqual(-1);
    expect(compareBreakpoint('sm', 'sm')).toEqual(0);
    expect(compareBreakpoint('sm', 'xs')).toEqual(1);
    expect(compareBreakpoint('sm', 'lg')).toEqual(-2);
});

test('breakpointsMedia', () => {
    expect(breakpointsMedia.xs).toEqual(`(width >= ${breakpoints.xs})`);
    expect(breakpointsMedia.lg).toEqual('(width >= 1024px)');
});
