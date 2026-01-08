// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Extractor } from './extract';

describe('Extractor', { timeout: 20000 }, () => {
    const p = new Extractor();

    test('load', () => {
        p.load('../../../packages/components');
        expect(p.extract('@cmfx/components', '', 'ButtonProps')).toBeDefined();
    });
});
