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
    const [Wrap, wrap] = boolSelector('_d.demo.wrap');

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Editable />
            <Wrap />
        </Portal>

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
