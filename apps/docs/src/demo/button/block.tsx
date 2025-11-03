// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, MountProps } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';
import { Portal } from 'solid-js/web';

import { boolSelector, buttonKindSelector } from '../base';

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

        <div class="flex flex-col gap-y-2">
            <Button class="w-full" disabled={disabled()} rounded={rounded()} kind={kind()} palette='primary'>block</Button>

            <Button class="w-full" disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
                <IconFace />with icon
            </Button>

            <ButtonGroup class="w-full" rounded={rounded()} palette='primary' kind={kind()} disabled={disabled()}>
                <Button>abc</Button>
                <Button>def</Button>
                <Button>hij</Button>
                <Button>klm</Button>
            </ButtonGroup>
        </div>
    </div>;
}
