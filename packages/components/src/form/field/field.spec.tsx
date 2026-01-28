// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import Field, { calcLayoutFieldAreas, fieldArea2Style } from './field';

describe('fieldArea2Style', () => {
    test('pos', () => {
        expect(fieldArea2Style({ pos: 'top-start' }))
            .toEqual({ 'grid-area': 'top-start' });
    });

    test('pos-cols', () => {
        expect(fieldArea2Style({ pos: 'top-start', cols: 2 }))
            .toEqual({
                'grid-area': 'top-start',
                'grid-column-end': 'span 2'
            });
    });

    test('pos-cols-rows', () => {
        expect(fieldArea2Style({ pos: 'top-start', cols: 2, rows: 3 }))
            .toEqual({
                'grid-area': 'top-start',
                'grid-column-end': 'span 2',
                'grid-row-end': 'span 3'
            });
    });

    test('pos-rows', () => {
        expect(fieldArea2Style({ pos: 'top-start', rows: 3 }))
            .toEqual({
                'grid-area': 'top-start',
                'grid-row-end': 'span 3'
            });
    });
});

describe('calcLayoutFieldAreas', () => {
    test('horizontal', () => {
        expect(calcLayoutFieldAreas('horizontal', false, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3, rows: 3 },
        });

        expect(calcLayoutFieldAreas('horizontal', false, true)).toEqual({
            labelArea: { pos: 'top-start', rows: 3 },
            inputArea: { pos: 'top-center', cols: 2, rows: 3 },
        });

        expect(calcLayoutFieldAreas('horizontal', true, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3, rows: 2 },
            helpArea: { pos: 'bottom-start', cols: 3 }
        });

        expect(calcLayoutFieldAreas('horizontal', true, true)).toEqual({
            labelArea: { pos: 'top-start', rows: 2 },
            inputArea: { pos: 'top-center', cols: 2 ,rows: 2 },
            helpArea: { pos: 'bottom-center', cols: 2 }
        });
    });

    test('vertical', () => {
        expect(calcLayoutFieldAreas('vertical', false, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3, rows: 3 },
        });

        expect(calcLayoutFieldAreas('vertical', false, true)).toEqual({
            labelArea: {pos: 'top-start', cols: 3 },
            inputArea: { pos: 'middle-start', cols: 3, rows: 2 },
        });

        expect(calcLayoutFieldAreas('vertical', true, false)).toEqual({
            inputArea: { pos: 'top-start', cols: 3 },
            helpArea: { pos: 'middle-start', cols: 3, rows: 2 }
        });

        expect(calcLayoutFieldAreas('vertical', true, true)).toEqual({
            labelArea: {pos: 'top-start', cols: 3 },
            inputArea: { pos: 'middle-start', cols: 3 },
            helpArea: { pos: 'bottom-start', cols: 3 }
        });
    });
});

describe('Field', async () => {
    const ct = await ComponentTester.build(
        'Field',
        props => <Field {...props} />
    );

    test('props', () => ct.testProps());
});
