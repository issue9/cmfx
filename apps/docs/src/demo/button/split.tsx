// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { SplitButton, SplitButtonItem, MountProps } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { Portal } from 'solid-js/web';

import { buttonKindSelector, boolSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [kindS, kind] = buttonKindSelector();
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');
    const [paletteS, palette] = paletteSelector();

    const menus: Array<SplitButtonItem> = [
        { type: 'button', label: 'button1', onclick: () => console.log('btn1') },
        { type: 'a', label: 'nav(home)', onclick: () => console.log('btn2'), href: '/' },
        { type: 'divider' },
        { type: 'button', label: 'confirm', onclick: () => confirm('confirm') },
        { type: 'button', label: 'confirm(ctrl+alt+d)', onclick: () => confirm('confirm(ctrl+alt+d)'), hotkey: new Hotkey('d', 'control', 'alt') }
    ];

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {kindS}
            {disabledS}
            {roundedS}
        </Portal>

        <div class="flex flex-wrap items-center gap-2">
            <SplitButton palette={palette()} kind={kind()} rounded={rounded()} disabled={disabled()} menus={menus}>split-button</SplitButton>
        </div>
    </>;
}
