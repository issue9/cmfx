// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import Field, { calcLayoutFieldAreas, HelpArea, fieldArea2Style } from './field';
import styles from './style.module.css';

describe('fieldArea2Style', () => {
    test('pos', () => {
        expect(fieldArea2Style({ pos: 'top-left' })).toEqual('grid-area: top-left;');
    });

    test('pos-cols', () => {
        expect(fieldArea2Style({ pos: 'top-left', cols: 2 }))
            .toEqual('grid-area: top-left;grid-column-end: span 2;');
    });

    test('pos-cols-rows', () => {
        expect(fieldArea2Style({ pos: 'top-left', cols: 2, rows: 3 }))
            .toEqual('grid-area: top-left;grid-column-end: span 2;grid-row-end: span 3;');
    });

    test('pos-rows', () => {
        expect(fieldArea2Style({ pos: 'top-left', rows: 3 }))
            .toEqual('grid-area: top-left;grid-row-end: span 3;');
    });
});

describe('calcLayoutFieldAreas', () => {
    test('horizontal', () => {
        expect(calcLayoutFieldAreas('horizontal', false, false)).toEqual({
            inputArea: { pos: 'top-left', cols: 3, rows: 3 },
        });

        expect(calcLayoutFieldAreas('horizontal', false, true)).toEqual({
            labelArea: { pos: 'top-left', rows: 3 },
            inputArea: { pos: 'top-center', cols: 2, rows: 3 },
        });

        expect(calcLayoutFieldAreas('horizontal', true, false)).toEqual({
            inputArea: { pos: 'top-left', cols: 3, rows: 2 },
            helpArea: { pos: 'bottom-left', cols: 3 }
        });

        expect(calcLayoutFieldAreas('horizontal', true, true)).toEqual({
            labelArea: { pos: 'top-left', rows: 2 },
            inputArea: { pos: 'top-center', cols: 2 ,rows: 2 },
            helpArea: { pos: 'bottom-center', cols: 2 }
        });
    });

    test('vertical', () => {
        expect(calcLayoutFieldAreas('vertical', false, false)).toEqual({
            inputArea: { pos: 'top-left', cols: 3, rows: 3 },
        });

        expect(calcLayoutFieldAreas('vertical', false, true)).toEqual({
            labelArea: {pos: 'top-left', cols: 3 },
            inputArea: { pos: 'middle-left', cols: 3, rows: 2 },
        });

        expect(calcLayoutFieldAreas('vertical', true, false)).toEqual({
            inputArea: { pos: 'top-left', cols: 3 },
            helpArea: { pos: 'middle-left', cols: 3, rows: 2 }
        });

        expect(calcLayoutFieldAreas('vertical', true, true)).toEqual({
            labelArea: {pos: 'top-left', cols: 3 },
            inputArea: { pos: 'middle-left', cols: 3 },
            helpArea: { pos: 'bottom-left', cols: 3 }
        });
    });
});

describe('Field', () => {
    test('!help && !label', async () => {
        const { container, unmount } = render(() => <Field {...calcLayoutFieldAreas('horizontal', false, false)}><label>input</label></Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.help)).toBeFalsy();
        expect(c.querySelector('label')).not.toBeFalsy();
        unmount();
    });

    test('help && !label', async () => {
        const { container, unmount } = render(() =>
            <Field {...calcLayoutFieldAreas('horizontal', true, false)}>
                <HelpArea area={{ pos: 'top-left' }} getError={()=>'error'} />
            </Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.help)).toBeTruthy();
        expect(c.querySelector('label')).toBeFalsy();
        unmount();
    });

    test('!help && label', async () => {
        const { container, unmount } = render(() => <Field {...calcLayoutFieldAreas('horizontal', false, true)}><label>input</label></Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.help)).toBeFalsy();
        expect(c.querySelector('label')).toBeTruthy();
        unmount();
    });

    test('help && label', async () => {
        const { container, unmount } = render(() =>
            <Field {...calcLayoutFieldAreas('horizontal', true, true)}>
                <HelpArea area={{ pos: 'top-left' }} getError={()=>'error'} /><label>input</label>
            </Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.help)).toBeTruthy();
        expect(c.querySelector('label')).toBeTruthy();
        unmount();
    });
});
