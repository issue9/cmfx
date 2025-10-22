// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ButtonKind, buttonKinds, ToggleButton, ToggleFullScreenButton, ToggleFitScreenButton } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { Accessor, JSX, Setter } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, boolSelector } from '../base';

export function kindSelector(v: ButtonKind = 'fill'): [JSX.Element, Accessor<ButtonKind>, Setter<ButtonKind>] {
    return arraySelector('风格', buttonKinds, v);
}

export default function() {
    const [kindS, kind] = kindSelector('fill');
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    let screenElement: HTMLDivElement;

    let toggleFlag1 = false;
    let toggleFlag2 = false;

    return <div>
        {kindS}
        {disabledS}
        {roundedS}

        <div class="flex flex-wrap items-center gap-2">
            <ToggleButton animation square disabled={disabled()} rounded={rounded()}
                kind={kind()} palette='tertiary' on={<IconClose />} off={<IconFace />}
                toggle={async () => toggleFlag2 = !toggleFlag2} hotkey={new Hotkey('b', 'shift')} />

            <ToggleButton square disabled={disabled()} rounded={rounded()}
                kind={kind()} palette='tertiary' on={<IconClose />} off={<IconFace />}
                toggle={async () => toggleFlag1 = !toggleFlag1} hotkey={new Hotkey('a', 'shift')} />

            <br />

            <ToggleFullScreenButton square disabled={disabled()} rounded={rounded()} kind={kind()}
                palette='primary' hotkey={new Hotkey('a', 'alt')} />
            <ToggleFullScreenButton square disabled={disabled()} rounded={rounded()} kind={kind()}
                palette='secondary' hotkey={new Hotkey('b', 'alt')} />

            <br />

            <div ref={el => screenElement = el}>
                <ToggleFitScreenButton square disabled={disabled()} rounded={rounded()} kind={kind()}
                    container={screenElement!} palette='primary' hotkey={new Hotkey('a', 'control')} />
                screen
            </div>
        </div>
    </div>;
}
