// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [editableS, editable] = boolSelector('可编辑');
    const [wrapS, wrap] = boolSelector('自动换行');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {editableS}
            {wrapS}
        </Portal>
        <Code editable={editable()} ln={0} wrap={wrap()} palette={palette()} class="h-50" lang="css">
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
    </div>;
}
