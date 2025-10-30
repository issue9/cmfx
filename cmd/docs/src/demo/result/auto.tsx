// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Result, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import { Error404 } from '@cmfx/illustrations';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');
    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Result title='网站更新中' layout='auto' palette={palette()} illustration={<Error404 />}>
            <div>网站更新中......</div>
        </Result>
    </>;
}
