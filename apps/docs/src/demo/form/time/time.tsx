// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, fieldAccessor, MountProps, TimePicker } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const ac = fieldAccessor('time', new Date('2024-01-02T15:34'));

    const [Palette, palette] = paletteSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Readonly />
            <Rounded />
            <Disabled />
            <Layout />
            <Button palette="primary" onclick={() => ac.setError(ac.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <TimePicker hasHelp placeholder='placeholder' layout={layout()} label='label' palette={palette()} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} />
    </div>;
}
