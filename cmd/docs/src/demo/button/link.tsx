// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonKind, buttonKinds, LinkButton } from '@cmfx/components';
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

        <div class="flex flex-wrap items-center gap-2">
            <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette='secondary'>secondary</LinkButton>
            <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette='surface'>surface</LinkButton>
            <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={kind()}>undefined</LinkButton>

            <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette='tertiary' square>
                <IconFace />
            </LinkButton>
            <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
                <IconFace class="me-1!" />with icon
            </LinkButton>

            <Button rounded kind='fill' palette='tertiary'>对比按钮</Button>
        </div>
    </div>;
}
