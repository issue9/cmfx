// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, MountProps, notifyTypes } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, paletteSelector } from '../base';

export function typeSelector() {
    return arraySelector('types', notifyTypes, 'error');
}

export default function (props: MountProps) {
    const [Palette, palette] = paletteSelector();
    const [Type, typ] = typeSelector();
    const [Closable, closable] = boolSelector('closable');

    return <div class="flex flex-col gap-3 w-full">
        <Portal mount={props.mount}>
            <Palette />
            <Type />
            <Closable />
        </Portal>
        <Alert closable={closable()} palette={palette()} type={typ()} title="Alert Title" body="Alert Message" />
        <Alert closable={closable()} palette={palette()} type={typ()} title="Alert Title"
            body="Alert Message Alert Message\nAlert Message Alert Message \n 使用 \ n 换行"
        />
    </div>;
}
