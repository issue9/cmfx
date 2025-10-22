// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Chart, ChartsOption } from '@cmfx/components';
import { createStore } from 'solid-js/store';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();

    const x = [1, 2, 3, 4, 5, 6, 7];
    const s1 = [15, 23, 22, 21, 13, 14, 26];
    const s2 = [10, 20, 24, 28, 15, 17, 20];
    let count = x.length;
    const [opt, setOpt] = createStore<ChartsOption>({
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
    });

    setInterval(() => {
        x.push(++count);
        s1.push(Math.floor(Math.random() * 10));
        s2.push(Math.floor(Math.random() * 10));
        x.shift();
        s1.shift();
        s2.shift();
        setOpt({
            xAxis: { data: [...x] },
            series: [
                { data: [...s1] },
                { data: [...s2] }
            ]
        });
    }, 500);

    return <div>
        {paletteS}
        <Chart palette={palette()} o={opt} />
    </div>;
}
