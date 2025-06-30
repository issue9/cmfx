// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code } from '@cmfx/components';

import { boolSelector, Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [copyableS, copyable] = boolSelector('copyable');

    return <Demo settings={
        <>
            {paletteS}
            {copyableS}
        </>
    }>
        <Stage title="code" class="w-full">
            <Code palette={palette()} copyable={copyable()}>
                {'<Button>Button</Button>'}
            </Code>
        </Stage>

        <Stage title="多行-滚动" class="w-full">
            <Code palette={palette()} copyable={copyable()} class="h-50">
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
            <Code palette={palette()} copyable={copyable()}>
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
