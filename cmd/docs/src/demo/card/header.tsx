// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, Label, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Card palette={palette()} header={<Label icon={<IconEye />}>title</Label>}>
            <p>这是一行文字</p>
            <Button palette='primary'>button</Button>
        </Card>
    </div>;
}
