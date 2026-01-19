// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, fieldAccessor, MountProps, TimePicker } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
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
