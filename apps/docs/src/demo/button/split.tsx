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
        { type: 'item', label: 'button1', onClick: () => console.log('btn1') },
        { type: 'item', label: 'button2', onClick: () => console.log('btn2') },
        { type: 'divider' },
        { type: 'item', label: 'confirm', onClick: () => confirm('confirm') },
        { type: 'item', label: 'confirm(ctrl+alt+d)', onClick: () => confirm('confirm(ctrl+alt+d)'), hotkey: new Hotkey('d', 'control', 'alt') }
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
