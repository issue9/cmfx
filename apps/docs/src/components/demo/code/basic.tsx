// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Code, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
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
