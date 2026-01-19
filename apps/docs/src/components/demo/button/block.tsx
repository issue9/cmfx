// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, buttonKindSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Kind, kind] = buttonKindSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    return <div>
        <Portal mount={props.mount}>
            <Kind />
            <Disabled />
            <Rounded />
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
