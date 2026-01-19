// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, MountProps, notifyTypes } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, boolSelector, paletteSelector } from '@docs/components/base';

export function typeSelector() {
    return arraySelector('types', notifyTypes, 'success');
}

export default function (props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector();
    const [Type, typ] = typeSelector();
    const [Closable, closable] = boolSelector('closable');

    return <div class="w-full flex flex-col gap-2">
        <Portal mount={props.mount}>
            <Palette />
            <Type />
            <Closable />
        </Portal>

        <Alert closable={closable()} palette={palette()} type={typ()} title="Alert Title" />

        <Alert closable={closable()} palette={palette()} type={typ()} title="Alert Title" icon={<IconFace />} />

        <Alert closable={closable()} palette={palette()} type={typ()} title="Alert Title" icon={false} />
    </div>;
}
