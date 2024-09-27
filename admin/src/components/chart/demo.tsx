// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as echarts from 'echarts';
import { createStore } from 'solid-js/store';

import { Demo, paletteSelector, Stage } from '@/components/base/demo';
import { default as Axis, Ref as AxisRef } from './axis';
import { default as Chart } from './chart';
import { default as Pie } from './pie';

interface Item {name:string, v1: number, v2: number}

const items: Array<Item> = [
    { name: 'name1', v1: 10, v2: 100 },
    { name: 'name2', v1: 12, v2: 99 },
    { name: 'name3', v1: 20, v2: 88 },
    { name: 'name4', v1: 23, v2: 89 },
    { name: 'name5', v1: 30, v2: 78 },
] as const;

export default function() {
    const [paletteS, palette] = paletteSelector();
    let axisRef: AxisRef<Item>;

    const x = [1, 2, 3, 4, 5, 6, 7];
    const s1 = [15, 23, 22, 21, 13, 14, 26];
    const s2 = [10, 20, 24, 28, 15, 17, 20];
    let count = x.length;
    const [opt, setOpt] = createStore<echarts.EChartsOption>({
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

        // axis
        axisRef.append(
            { name: 'name' + count, v1: 10 * Math.random(), v2: 50 * Math.random() },
            { name: 'name' + count, v1: 10 * Math.random(), v2: 50 * Math.random() },
        );
    }, 500);

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <Stage title="svg+chart">
                <Chart palette={palette()} o={opt} />
            </Stage>

            <Stage title="axis">
                <Axis palette={palette()} tooltip legend='right' selectedMode='single'
                    xAxis={{ name: 'X', key: 'name' }}
                    series={[{type:'line', key:'v1'}, {type:'bar', key:'v2', yAxisIndex: 1, area: true, smooth:true}]}
                    data={items} />
            </Stage>

            <Stage title="axis">
                <Axis palette={palette()} size={10} ref={el=>axisRef=el} tooltip legend='center'
                    xAxis={{ name: 'X', key: 'name' }}
                    series={[{type:'bar', key:'v2', yAxisIndex: 1}, {type:'line', key:'v1', area:true, smooth:true}, ]}
                    data={items} />
            </Stage>

            <Stage title="pie">
                <Pie tooltip legend='left' radius={['30%','50%']} padding={5} borderRadius={5}
                    data={[{name: 'aaa',value: 80, selected:true}, {name: 'bbb',value: 180}, {name: 'ccc',value: 20}, {name: 'ddd',value: 20}, {name: 'eee',value: 500}]} />
            </Stage>

            <Stage title="pie">
                <Pie legend='center' selectedMode='multiple'
                    data={[{name: 'aaa',value: 80}, {name: 'bbb',value: 180, selected:true}, {name: 'ccc',value: 20}, {name: 'ddd',value: 20}, {name: 'eee',value: 500}]} />
            </Stage>
        </>
    } />;
}
