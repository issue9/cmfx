// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, MountProps, Number, Pagination } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();
    const [page, setPage] = createSignal('');
    const span = fieldAccessor('spans', 3);

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Number class="w-20" accessor={span} />
        </Portal>

        <Pagination palette={palette()} count={10} value={5} spans={span.getValue()}
            onChange={(val, old) => { return setPage(`new:${val}, old:${old}`); }} />
        <pre>{page()}</pre>
    </div>;
}
