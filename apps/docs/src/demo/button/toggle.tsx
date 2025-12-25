// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, ToggleButton, ToggleFitScreenButton, ToggleFullScreenButton } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, buttonKindSelector } from '../base';

export default function(props: MountProps) {
    const [Kind, kind] = buttonKindSelector();
    const [Disabled, disabled] = boolSelector('disabled');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    let screenElement: HTMLDivElement;

    let toggleFlag2 = false;

    return <div>
        <Portal mount={props.mount}>
            <Kind />
            <Disabled />
            <Rounded />
        </Portal>

        <div class="flex flex-wrap items-center gap-2">
            <ToggleButton square disabled={disabled()} rounded={rounded()}
                kind={kind()} palette='tertiary' on={<IconClose />} off={<IconFace />}
                toggle={async () => toggleFlag2 = !toggleFlag2} hotkey={new Hotkey('b', 'shift')} />

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
