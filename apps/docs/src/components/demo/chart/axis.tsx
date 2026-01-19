// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { ChartAxis, ChartAxisRef, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

interface Item {name:string, v1: number, v2: number}

const items: Array<Item> = [
    { name: 'name1', v1: 10, v2: 100 },
    { name: 'name2', v1: 12, v2: 99 },
    { name: 'name3', v1: 20, v2: 88 },
    { name: 'name4', v1: 23, v2: 89 },
    { name: 'name5', v1: 30, v2: 78 },
] as const;

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector();

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
            <Palette />
        </Portal>

        <div>
            <ChartAxis palette={palette()} tooltip legend='right' selectedMode='single'
                xAxis={{ name: 'X', key: 'name' }} yAxis='YYY'
                series={[{ type: 'line', key: 'v1' }, { type: 'bar', key: 'v2', yAxisIndex: 1, area: true }]}
                initValue={items} />
        </div>

        <div>
            <ChartAxis palette={palette()} size={10} ref={el => axisRef = el} tooltip legend='center'
                xAxis={{ name: 'X', key: 'name' }}
                series={[{ type: 'bar', key: 'v2', yAxisIndex: 1, smooth: true }, { type: 'line', key: 'v1', area: true, smooth: true },]}
                initValue={items} />
        </div>
    </div>;
}
