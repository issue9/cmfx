// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Result } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
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
