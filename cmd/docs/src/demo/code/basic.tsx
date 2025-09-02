// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code } from '@cmfx/components';

import { boolSelector, paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [editableS, editable] = boolSelector('可编辑');

    return <div>
        {paletteS}
        {editableS}
        <Code lang="tsx" palette={palette()} ln={11} editable={editable()} oninput={v => console.log(v)}>
            {'<Button>Button</Button>'}
        </Code>
    </div>;
}
