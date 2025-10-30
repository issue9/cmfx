// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Search, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector, boolSelector } from '../base';
import { Hotkey } from '@cmfx/core';

export default function (props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');
    const [iconS, icon] = boolSelector('icon');
    const [clearS, clear] = boolSelector('clear');

    const items = [
        'abcdef@example.com',
        'abcdef1@example.com',
        'abcdef2@example.com',
        'abcdef3@example.com',
        'abcdef4@example.com',
    ];

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {iconS}
            {clearS}
        </Portal>

        <Search icon={icon()} clear={clear()} palette={palette()} hotkey={new Hotkey('a', 'alt', 'control')} onSearch={async (v) => {
            if (!v) {
                return items.map(vv => { return { type: 'a', label: vv, value: vv }; });
            }

            return items.filter(vv => vv.includes(v))
                .map(vv => { return { type: 'a', label: vv, value: vv }; });
        }} />
    </>;
}
