// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconSync from '~icons/material-symbols/sync';

import { boolSelector, buttonKindSelector } from '../base';

export default function(props: MountProps) {
    const [Kind, kind] = buttonKindSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    return <div>
        <Portal mount={props.mount}>
            <Kind />
            <Disabled />
            <Rounded />
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
                <Button type='a' href='.'>abc</Button>
                <Button type='a' href='.'>def</Button>
                <Button type='a' href='.'>hij</Button>
            </ButtonGroup>

            <ButtonGroup rounded={rounded()} kind={kind()} disabled={disabled()}>
                <Button type='a' square href=""><IconFace /></Button>
                <Button type='a' square href=""><IconClose /></Button>
                <Button type='a' square href=""><IconSync /></Button>
            </ButtonGroup>
        </div>
    </div>;
}
