// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, ButtonKind, buttonKinds } from '@cmfx/components';
import { Accessor, JSX, Setter } from 'solid-js';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, boolSelector } from '../base';

export function kindSelector(v: ButtonKind = 'fill'): [JSX.Element, Accessor<ButtonKind>, Setter<ButtonKind>] {
    return arraySelector('风格', buttonKinds, v);
}

export default function() {
    const [kindS, kind] = kindSelector('fill');
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    return <div>
        {kindS}
        {disabledS}
        {roundedS}
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
