// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import Field, { calcLayoutFieldAreas } from './field';
import styles from './style.module.css';

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
            inputArea: { pos: 'top-left', cols: 3 },
            helpArea: { pos: 'middle-left', cols: 3, rows: 2 }
        });

        expect(calcLayoutFieldAreas('horizontal', true, true)).toEqual({
            labelArea: { pos: 'top-left' },
            inputArea: { pos: 'top-center', cols: 2 },
            helpArea: { pos: 'middle-center', cols: 2, rows: 2 }
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
        const { container, unmount } = render(() => <Field {...calcLayoutFieldAreas('horizontal', false, false)}>input</Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.content)).toBeTruthy();
        expect(c.querySelector('.' + styles.help)).toBeFalsy();
        expect(c.querySelector('label')).toBeFalsy();
        unmount();
    });

    test('help && !label', async () => {
        const { container, unmount } = render(() => <Field {...calcLayoutFieldAreas('horizontal', true, false)}>input</Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.content)).toBeTruthy();
        expect(c.querySelector('.' + styles.help)).toBeTruthy();
        expect(c.querySelector('label')).toBeFalsy();
        unmount();
    });

    test('!help && label', async () => {
        const { container, unmount } = render(() => <Field {...calcLayoutFieldAreas('horizontal', false, true)}>input</Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.content)).toBeTruthy();
        expect(c.querySelector('.' + styles.help)).toBeFalsy();
        expect(c.querySelector('label')).toBeTruthy();
        unmount();
    });

    test('help && label', async () => {
        const { container, unmount } = render(() => <Field {...calcLayoutFieldAreas('horizontal', true, true)}>input</Field>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        const c = container.children.item(0)!;
        expect(c.querySelector('.' + styles.content)).toBeTruthy();
        expect(c.querySelector('.' + styles.help)).toBeTruthy();
        expect(c.querySelector('label')).toBeTruthy();
        unmount();
    });
});
