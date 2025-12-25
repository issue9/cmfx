// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Album, Button, fieldAccessor, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps): JSX.Element {
    const [Reverse, reverse] = boolSelector('reverse');
    const [Auto, auto] = boolSelector('auto');
    const [Palette, palette] = paletteSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');

    const basicA = fieldAccessor('upload', ['../../../../../../apps/admin/public/icon.svg', './test.jpg']);

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Reverse />
            <Auto />
            <Layout />
            <Button palette="primary" onclick={() => basicA.setError(basicA.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <div title='basic'>
            <Album hasHelp layout={layout()} fieldName='file' label="label" class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} auto={auto()}
                accessor={basicA} upload={async () => []} />
        </div>

        <div title='basic+drop'>
            <Album hasHelp layout={layout()} fieldName='file' class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} droppable auto={auto()}
                accessor={basicA} upload={async () => []} />
        </div>
    </>;
}
