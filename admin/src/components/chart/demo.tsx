// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Demo, paletteSelector } from '@/components/base/demo';
import { default as Chart } from './chart';

export default function() {
    const [paletteS, palette] = paletteSelector();

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <div>
                <p>chart</p>
                <Chart renderer='svg' o={{
                    title: {show: false},
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: [15, 23, 22, 21, 13, 14, 26],
                            type: 'line'
                        },
                        {
                            data: [10, 20, 24, 28, 15, 17, 20],
                            type: 'bar'
                        },
                    ]
                }} />
            </div>
        </>
    } />;
}
