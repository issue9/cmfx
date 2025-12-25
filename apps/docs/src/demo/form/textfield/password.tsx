// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, fieldAccessor, MountProps, Password } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const pwd = fieldAccessor('name', 'pwd');

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
            <Button palette="primary" onclick={() => {
                pwd.setError(pwd.getError() ? undefined : 'error');
            }}>toggle error</Button>
        </Portal>

        <Password hasHelp layout={layout()} placeholder='placeholder' label="password"
            prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
            rounded={rounded()} readonly={readonly()} accessor={pwd} />
    </div>;
}
