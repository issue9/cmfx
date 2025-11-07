// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Chart, ChartsOption } from './chart';

describe('Chart', async () => {
    const x = [1, 2, 3, 4, 5, 6, 7];
    const s1 = [15, 23, 22, 21, 13, 14, 26];
    const s2 = [10, 20, 24, 28, 15, 17, 20];

    const opt: ChartsOption = {
        title: { show: false },
        xAxis: {
            type: 'category',
            data: x
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: s1,
                type: 'line'
            },
            {
                data: s2,
                type: 'bar'
            },
        ]
    };
    const ct = await ComponentTester.build('Chart', props => <Chart o={opt} {...props} />);

    // 根元素的基本属性检测
    test('props', async () => {
        ct.testProps();
    });
});
