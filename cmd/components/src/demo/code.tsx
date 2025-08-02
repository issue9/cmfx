// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code } from '@cmfx/components';

import { createSignal } from 'solid-js';
import { boolSelector, Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [copyableS, copyable] = boolSelector('copyable');
    const [editableS, editable] = boolSelector('可编辑');
    const [breakS, breakk] = boolSelector('自动换行');

    const [str, setStr] = createSignal('');

    return <Demo settings={
        <>
            {paletteS}
            {copyableS}
            {editableS}
            {breakS}
        </>
    }>
        <Stage title="code" class="w-full">
            <Code palette={palette()} copyable={copyable()} editable={editable()} oninput={v=>setStr(v)}>
                {'<Button>Button</Button>'}
            </Code>
            <span>{ str() }</span>
        </Stage>

        <Stage title="多行-滚动" class="w-full">
            <Code break={breakk()} palette={palette()} copyable={copyable()} class="h-50">
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
            <Code break={breakk()} palette={palette()} copyable={copyable()}>
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
    </Demo>;
}
