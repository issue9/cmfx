// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { ChartAxis, Ref } from './axis';

describe('ChartAxis', async () => {
    interface Item {name:string, v1: number, v2: number}

    const items: Array<Item> = [
        { name: 'name1', v1: 10, v2: 100 },
        { name: 'name2', v1: 12, v2: 99 },
        { name: 'name3', v1: 20, v2: 88 },
        { name: 'name4', v1: 23, v2: 89 },
        { name: 'name5', v1: 30, v2: 78 },
    ] as const;

    let ref: Ref<Item>;

    const ct = await ComponentTester.build('ChartAxis', props => <ChartAxis ref={el => ref = el} initValue={items} {...props}
        xAxis={{ name: 'X', key: 'name' }}
        series={[{ type: 'bar', key: 'v2', yAxisIndex: 1 }, { type: 'line', key: 'v1', area: true },]}
    />);

    test('props', async () => {
        ct.testProps();
    });

    test('ref', async () => {
        expect(ref).toBeDefined();
        expect(ref.root()).toBeInstanceOf(HTMLDivElement);
    });
});
