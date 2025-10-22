// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Album, fieldAccessor } from '@cmfx/components';
import { JSX } from 'solid-js';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(): JSX.Element {
    const [paletteS, palette] = paletteSelector('secondary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [reverseS, reverse] = boolSelector('reverse');
    const [autoS, auto] = boolSelector('auto');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    const basicA = fieldAccessor('upload', ['../../../../../../cmd/admin/public/icon.svg', './test.jpg']);

    return <div>
        {paletteS}
        {disabledS}
        {reverseS}
        {autoS}
        {layoutS}
        <button class="palette--primary" onClick={() => basicA.setError(basicA.getError() ? undefined : 'error')}>toggle error</button>

        <div title='basic'>
            <Album hasHelp layout={layout()} fieldName='file' label="label" class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} auto={auto()}
                action='./' accessor={basicA} />
        </div>

        <div title='basic+drop'>
            <Album hasHelp layout={layout()} fieldName='file' class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} droppable auto={auto()}
                action='./' accessor={basicA} />
        </div>
    </div>;
}
