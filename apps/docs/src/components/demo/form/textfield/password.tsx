// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, fieldAccessor, MountProps, Password } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const pwd = fieldAccessor('name', 'pwd');

    const [Palette, palette] = paletteSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);
    const [Count, count] = boolSelector('_d.demo.charCount', false);

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Readonly />
            <Rounded />
            <Disabled />
            <Layout />
            <Count />
            <Button palette="primary" onclick={() => {
                pwd.setError(pwd.getError() ? undefined : 'error');
            }}>toggle error</Button>
        </Portal>

        <Password count={count()} hasHelp layout={layout()} placeholder='placeholder' label="password"
            prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
            rounded={rounded()} readonly={readonly()} accessor={pwd} />
    </div>;
}
