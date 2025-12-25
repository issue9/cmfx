// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Card palette={palette()} footer={<><Button>OK</Button> <Button>Cancel</Button></>}>
            <p>不带标题，但是有页脚。</p>
            <Button palette='primary'>button</Button>
        </Card>
    </div>;
}
