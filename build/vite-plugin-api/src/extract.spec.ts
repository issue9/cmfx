// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { Extractor } from './extract';

describe('Extractor', { timeout: 20000 }, () => {
    const p = new Extractor();

    test('load', () => {
        p.load(path.resolve(__dirname, '../../../packages/components'));
        expect(p.extract('@cmfx/components', '', 'ButtonProps')).toBeDefined();
    });
});
