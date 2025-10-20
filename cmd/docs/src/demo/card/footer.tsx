// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        <Card palette={palette()} footer={<><Button>OK</Button> <Button>Cancel</Button></>}>
            <p>不带标题，但是有页脚。</p>
            <Button palette='primary'>button</Button>
        </Card>
    </div>;
}
