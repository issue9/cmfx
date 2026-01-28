// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { calcLayoutFieldAreas } from './area';

describe('calcLayoutFieldAreas', () => {
    test('horizontal', () => {
        expect(calcLayoutFieldAreas('horizontal', false, false, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3, rows: 3 },
        });

        expect(calcLayoutFieldAreas('horizontal', false, false, true)).toEqual({
            inputArea: { pos: 'top-start', cols: 2, rows: 3 },
            countArea: { pos: 'top-end', rows: 3 },
        });

        expect(calcLayoutFieldAreas('horizontal', false, true, false)).toEqual({
            labelArea: { pos: 'top-start', rows: 3 },
            inputArea: { pos: 'top-center', cols: 2, rows: 3 },
        });

        expect(calcLayoutFieldAreas('horizontal', true, false, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3, rows: 2 },
            helpArea: { pos: 'bottom-start', cols: 3 }
        });

        expect(calcLayoutFieldAreas('horizontal', true, true, false)).toEqual({
            labelArea: { pos: 'top-start', rows: 2 },
            inputArea: { pos: 'top-center', cols: 2 ,rows: 2 },
            helpArea: { pos: 'bottom-center', cols: 2 }
        });

        expect(calcLayoutFieldAreas('horizontal', true, true, true)).toEqual({
            labelArea: { pos: 'top-start', rows: 2 },
            inputArea: { pos: 'top-center', cols: 2 ,rows: 2 },
            helpArea: { pos: 'bottom-center' },
            countArea: { pos: 'bottom-end' }
        });
    });

    test('vertical', () => {
        expect(calcLayoutFieldAreas('vertical', false, false, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3, rows: 3 },
        });

        expect(calcLayoutFieldAreas('vertical', false, true, false)).toEqual({
            labelArea: {pos: 'top-start', cols: 3 },
            inputArea: { pos: 'middle-start', cols: 3, rows: 2 },
        });

        expect(calcLayoutFieldAreas('vertical', false, true, true)).toEqual({
            labelArea: {pos: 'top-start', cols: 2 },
            inputArea: { pos: 'middle-start', cols: 3, rows: 2 },
            countArea: { pos: 'top-end' },
        });

        expect(calcLayoutFieldAreas('vertical', true, false, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3 },
            helpArea: { pos: 'middle-start', cols: 3, rows: 2 }
        });

        expect(calcLayoutFieldAreas('vertical', true, true, false)).toEqual({
            labelArea: {pos: 'top-start', cols: 3 },
            inputArea: { pos: 'middle-start', cols: 3 },
            helpArea: { pos: 'bottom-start', cols: 3 }
        });

        expect(calcLayoutFieldAreas('vertical', true, true, true)).toEqual({
            labelArea: {pos: 'top-start', cols: 3 },
            inputArea: { pos: 'middle-start', cols: 3 },
            helpArea: { pos: 'bottom-start', cols: 2 },
            countArea: { pos: 'bottom-end' },
        });
    });
});
