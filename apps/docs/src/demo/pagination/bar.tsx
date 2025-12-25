// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, MountProps, Number, PaginationBar } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();
    const span = fieldAccessor('spans', 3);

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Number class="w-20" accessor={span} />
        </Portal>

        <PaginationBar spans={span.getValue()} palette={palette()} total={100} page={2} size={20} />
    </div>;
}
