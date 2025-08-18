// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code } from '@cmfx/components';

import { boolSelector, Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [editableS, editable] = boolSelector('可编辑');
    const [breakS, breakk] = boolSelector('自动换行');

    return <Demo settings={
        <>
            {paletteS}
            {editableS}
            {breakS}
        </>
    }>
        <Stage title="code" class="w-full">
            <Code palette={palette()} editable={editable()} oninput={v => console.log(v)}>
                {'<Button>Button</Button>'}
            </Code>
        </Stage>

        <Stage title="多行-滚动" class="w-full">
            <Code break={breakk()} palette={palette()} class="h-50" lang="css">
                {`/*
 * SPDX-FileCopyrightText: 2025 caixw
 *
 * SPDX-License-Identifier: MIT
 */

@reference '../style.css';

@layer components {
    .code {
        @apply font-mono w-full h-full overflow-auto rounded-lg relative;
        @apply border border-palette-bg-low;

        .action {
            @apply flex justify-end absolute top-0 right-0;
        }
    }
}
`}
            </Code>
        </Stage>

        <Stage title="多行-不滚动" class="w-full">
            <Code break={breakk()} palette={palette()} lang="tsx" editable={editable()} oninput={v=>console.log(v)}>
                {`/*
* SPDX-FileCopyrightText: 2025 caixw
*
* SPDX-License-Identifier: MIT
*/

import { Code } from '@cmfx/components';

import { createSignal } from 'solid-js';
import { boolSelector, Demo, paletteSelector, Stage } from './base';

export default function() {
}
`}
            </Code>
        </Stage>
    </Demo>;
}
