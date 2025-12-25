// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Search } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function (props: MountProps) {
    const [Palette, palette] = paletteSelector('primary');
    const [Icon, icon] = boolSelector('icon');
    const [Clear, clear] = boolSelector('clear');

    const items = [
        'abcdef@example.com',
        'abcdef1@example.com',
        'abcdef2@example.com',
        'abcdef3@example.com',
        'abcdef4@example.com',
    ];

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Icon />
            <Clear />
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
