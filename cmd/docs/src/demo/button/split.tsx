// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ButtonKind, buttonKinds, SplitButton, SplitButtonItem, MountProps } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { Accessor, For, JSX, Setter } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, palettesWithUndefined } from '../base';

export function kindSelector(v: ButtonKind = 'fill'): [JSX.Element, Accessor<ButtonKind>, Setter<ButtonKind>] {
    return arraySelector('风格', buttonKinds, v);
}

export default function(props: MountProps) {
    const [kindS, kind] = kindSelector('fill');
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    return <div>
        <Portal mount={props.mount}>
            {kindS}
            {disabledS}
            {roundedS}
        </Portal>

        <div class="flex flex-wrap items-center gap-2">
            <For each={palettesWithUndefined}>
                {(c, index) => {
                    const menus: Array<SplitButtonItem> = [
                        { type: 'item', label: 'button1', onClick: () => console.log('btn1') },
                        { type: 'item', label: 'button2', onClick: () => console.log('btn2') },
                        { type: 'divider' },
                        { type: 'item', label: 'confirm', onClick: () => confirm('confirm') },
                    ];
                    if (index() === 1) {
                        menus.push({ type: 'item', label: 'confirm(ctrl+alt+d)', onClick: () => confirm('confirm(ctrl+alt+d)'), hotkey: new Hotkey('d', 'control', 'alt') });
                    }
                    return <SplitButton palette={c} kind={kind()} rounded={rounded()} disabled={disabled()} menus={menus}>split-button</SplitButton>;
                }}
            </For>
        </div>
    </div>;
}
