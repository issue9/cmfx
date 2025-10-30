// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [editableS, editable] = boolSelector('可编辑');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {editableS}
        </Portal>

        <Code lang="tsx" palette={palette()} ln={11} editable={editable()} oninput={v => console.log(v)}>
            {'<Button>Button</Button>'}
        </Code>
    </div>;
}
