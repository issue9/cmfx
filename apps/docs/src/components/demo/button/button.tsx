// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';
import IconSync from '~icons/material-symbols/sync';

import { boolSelector, buttonKindSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Kind, kind] = buttonKindSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    return <div class="w-full min-w-90">
        <Portal mount={props.mount}>
            <Kind />
            <Disabled />
            <Rounded />
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
