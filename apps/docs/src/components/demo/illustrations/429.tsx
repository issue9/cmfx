// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps } from '@cmfx/components';
import * as illustrations from '@cmfx/illustrations';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector();
    const [Custom, custom] = boolSelector('自定义文字内容', false);

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Custom />
        </Portal>

        <illustrations.Error429 class='bg-palette-bg aspect-square w-full' palette={palette()} text={custom() ? '请求过多' : undefined} />
    </>;
}
