// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Divider, DividerProps, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, layoutSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [layoutS, layout] = layoutSelector('布局', 'vertical');
    const [posS, pos] = arraySelector<DividerProps['pos']>('pos', ['start', 'center', 'end'], 'start');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {layoutS}
            {posS}
        </Portal>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <IconFace />起始位置
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <IconFace />english
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <span style={{ 'writing-mode': 'vertical-rl', 'text-orientation': 'upright' }}>起始位置<span>111</span></span>
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <span style={{ 'writing-mode': 'vertical-rl', 'text-orientation': 'upright', 'display': 'flex', 'align-items': 'center' }}>
                    english<IconFace />
                </span>
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}></Divider>
        </div>
    </div>;
}
