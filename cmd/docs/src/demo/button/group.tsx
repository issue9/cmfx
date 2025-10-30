// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, ButtonKind, buttonKinds, LinkButton, MountProps } from '@cmfx/components';
import { Accessor, JSX, Setter } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconSync from '~icons/material-symbols/sync';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector } from '../base';

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
            <ButtonGroup rounded={rounded()} palette='primary' kind={kind()} disabled={disabled()}>
                <Button checked>abc</Button>
                <Button>def</Button>
                <Button>hij</Button>
            </ButtonGroup>

            <ButtonGroup layout='vertical' rounded={rounded()} palette='secondary' kind={kind()} disabled={disabled()}>
                <Button>abc</Button>
                <Button>def</Button>
                <Button>hij</Button>
            </ButtonGroup>

            <ButtonGroup rounded={rounded()} palette='tertiary' kind={kind()} disabled={disabled()}>
                <Button square><IconFace /></Button>
                <Button square><IconClose /></Button>
                <Button square><IconSync /></Button>
            </ButtonGroup>

            <ButtonGroup rounded={rounded()} palette='surface' kind={kind()} disabled={disabled()}>
                <LinkButton href='.'>abc</LinkButton>
                <LinkButton href='.'>def</LinkButton>
                <LinkButton href='.'>hij</LinkButton>
            </ButtonGroup>

            <ButtonGroup rounded={rounded()} kind={kind()} disabled={disabled()}>
                <LinkButton square href=""><IconFace /></LinkButton>
                <LinkButton square href=""><IconClose /></LinkButton>
                <LinkButton square href=""><IconSync /></LinkButton>
            </ButtonGroup>
        </div>
    </div>;
}
