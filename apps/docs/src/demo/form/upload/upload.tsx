// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Album, fieldAccessor, MountProps, Button } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import { JSX } from 'solid-js';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps): JSX.Element {
    const [paletteS, palette] = paletteSelector('secondary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [reverseS, reverse] = boolSelector('reverse');
    const [autoS, auto] = boolSelector('auto');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    const basicA = fieldAccessor('upload', ['../../../../../../apps/admin/public/icon.svg', './test.jpg']);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {disabledS}
            {reverseS}
            {autoS}
            {layoutS}
            <Button palette="primary" onclick={() => basicA.setError(basicA.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <div title='basic'>
            <Album hasHelp layout={layout()} fieldName='file' label="label" class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} auto={auto()}
                accessor={basicA} upload={async obj=>[]} />
        </div>

        <div title='basic+drop'>
            <Album hasHelp layout={layout()} fieldName='file' class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} droppable auto={auto()}
                accessor={basicA} upload={async obj=>[]} />
        </div>
    </>;
}
