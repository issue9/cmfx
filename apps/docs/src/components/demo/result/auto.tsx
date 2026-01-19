// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Result } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector('primary');

    return <>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Result title='网站更新中' layout='auto' palette={palette()} illustration={<Error404 />}>
            <div>网站更新中......</div>
        </Result>
    </>;
}
