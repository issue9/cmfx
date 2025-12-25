// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Button, MountProps, useOptions } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [, opt] = useOptions();
    const [Palette, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Appbar palette={palette()} title="这个公司的名称有一点点长哦！" logo={opt.logo} actions={
            <>
                <Button square><IconEye /></Button>
                <Button square><IconEye /></Button>
            </>
        }>
            <IconEye />
        </Appbar>
    </>;
}
