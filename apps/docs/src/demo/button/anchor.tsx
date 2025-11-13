// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';
import { Portal } from 'solid-js/web';

import { buttonKindSelector, boolSelector } from '../base';

export default function(props: MountProps) {
    const [kindS, kind] = buttonKindSelector();
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    return <div>
        <Portal mount={props.mount}>
            {kindS}
            {disabledS}
            {roundedS}
        </Portal>

        <div class="flex flex-wrap items-center gap-2">
            <Button type='a' href="./" disabled={disabled()} rounded={rounded()}
                kind={kind()} palette='secondary'>secondary</Button>
            <Button type='a' href="./" disabled={disabled()} rounded={rounded()}
                kind={kind()} palette='surface'>surface</Button>
            <Button type='a' href="./" disabled={disabled()} rounded={rounded()}
                kind={kind()} palette='surface' onclick={()=>alert('click1')}>click+href</Button>
            <Button type='a' href="./" disabled={disabled()} rounded={rounded()}
                kind={kind()}>undefined</Button>

            <Button type='a' href="./" disabled={disabled()} rounded={rounded()}
                kind={kind()} palette='tertiary' square>
                <IconFace />
            </Button>
            <Button type='a' href="./" disabled={disabled()} rounded={rounded()}
                kind={kind()} palette="primary">
                <IconFace class="me-1!" />with icon
            </Button>

            <Button rounded kind='fill' palette='tertiary'>对比按钮</Button>
        </div>
    </div>;
}
