// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code } from '@cmfx/components';

import { boolSelector, paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [editableS, editable] = boolSelector('可编辑');
    const [wrapS, wrap] = boolSelector('自动换行');

    return <div>
        {paletteS}
        {editableS}
        {wrapS}
        <Code wrap={wrap()} ln={21} class="w-100" palette={palette()} lang="tsx" editable={editable()} oninput={v => console.log(v)}>
            {`/*
 * SPDX-FileCopyrightText: 2025 caixw
 *
 * SPDX-License-Identifier: MIT
 */

import { Code } from '@cmfx/components';

import { createSignal, JSX } from 'solid-js';
import { boolSelector, Demo, paletteSelector, Stage } from './base';

export default function(props: Props): JSX.Element {
    const [paletteS, palette] = paletteSelector();
    const [editableS, editable] = boolSelector('可编辑');
    const [breakS, breakk] = boolSelector('自动换行');

    return <Code lang="tsx" editable={editable()} break={breakk()} palette={palette()}>
        // TODO
    </Code>;
}
`}
        </Code>
    </div>;
}
