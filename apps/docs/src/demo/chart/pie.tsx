// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ChartPie, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <div>
            <ChartPie palette={palette()} tooltip legend='left' radius={['30%', '50%']} padding={5} borderRadius={5}
                initValue={[{ name: 'aaa', value: 80, selected: true }, { name: 'bbb', value: 180 }, { name: 'ccc', value: 20 }, { name: 'ddd', value: 20 }, { name: 'eee', value: 500 }]} />
        </div>

        <div>
            <ChartPie palette={palette()} legend='center' selectedMode='multiple'
                initValue={[{ name: 'aaa', value: 80 }, { name: 'bbb', value: 180, selected: true }, { name: 'ccc', value: 20 }, { name: 'ddd', value: 20 }, { name: 'eee', value: 500 }]} />
        </div>
    </div>;
}
