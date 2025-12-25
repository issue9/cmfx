// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Editor, fieldAccessor, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function (props: MountProps) {
    const txt = fieldAccessor('name', '<p style="color:red">red</p><br />line2');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Palette, palette] = paletteSelector();
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Readonly />
            <Layout />
            <Button palette="primary" onclick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <Editor simple hasHelp help="help text" layout={layout()} label='label' class="h-[500px] w-full" palette={palette()} readonly={readonly()} disabled={disabled()} accessor={txt} />
        <pre>{txt.getValue()}</pre>
    </div>;
}
