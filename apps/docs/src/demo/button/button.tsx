// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';
import IconSync from '~icons/material-symbols/sync';
import { Portal } from 'solid-js/web';

import { boolSelector,buttonKindSelector } from '../base';

export default function(props: MountProps) {
    const [kindS, kind] = buttonKindSelector();
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    return <div class="w-full min-w-90">
        <Portal mount={props.mount}>
            {kindS}
            {disabledS}
            {roundedS}
        </Portal>

        <div class="flex flex-wrap items-center gap-2">
            <Button disabled={disabled()} rounded={rounded()} kind={kind()} palette='primary'>primary</Button>
            <Button disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
                <IconFace class="me-1" />with icon
            </Button>

            <Button square title='secondary' disabled={disabled()} rounded={rounded()} kind={kind()} palette='secondary'><IconSync /></Button>
            <Button rounded kind='fill' palette='tertiary'>a</Button>
        </div>
    </div>;
}
