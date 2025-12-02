// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ChartAxis, ChartAxisRef, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

interface Item {name:string, v1: number, v2: number}

const items: Array<Item> = [
    { name: 'name1', v1: 10, v2: 100 },
    { name: 'name2', v1: 12, v2: 99 },
    { name: 'name3', v1: 20, v2: 88 },
    { name: 'name4', v1: 23, v2: 89 },
    { name: 'name5', v1: 30, v2: 78 },
] as const;

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [smoothS, smooth] = boolSelector('smooth');

    let axisRef: ChartAxisRef<Item>;

    const x = [1, 2, 3, 4, 5, 6, 7];
    let count = x.length;

    setInterval(() => {
        count++;
        axisRef.append(
            { name: 'name' + count, v1: 10 * Math.random(), v2: 50 * Math.random() },
            { name: 'name' + count, v1: 10 * Math.random(), v2: 50 * Math.random() },
        );
    }, 500);

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {smoothS}
        </Portal>

        <div>
            <ChartAxis palette={palette()} tooltip legend='right' selectedMode='single'
                xAxis={{ name: 'X', key: 'name' }}
                series={[{ type: 'line', key: 'v1', smooth: smooth() }, { type: 'bar', key: 'v2', yAxisIndex: 1, area: true, smooth: smooth() }]}
                data={items} />
        </div>

        <div>
            <ChartAxis palette={palette()} size={10} ref={el => axisRef = el} tooltip legend='center'
                xAxis={{ name: 'X', key: 'name' }}
                series={[{ type: 'bar', key: 'v2', yAxisIndex: 1, smooth: smooth() }, { type: 'line', key: 'v1', area: true, smooth: smooth() },]}
                data={items} />
        </div>
    </div>;
}
