// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();
    const [Editable, editable] = boolSelector('_d.demo.editable');

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Editable />
        </Portal>

        <Code lang="tsx" palette={palette()} ln={11} editable={editable()} oninput={v => console.log(v)}>
            {'<Button>Button</Button>'}
        </Code>
    </div>;
}
