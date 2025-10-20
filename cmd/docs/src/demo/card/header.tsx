// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, Label } from '@cmfx/components';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        <Card palette={palette()} header={<Label icon={<IconEye />}>title</Label>}>
            <p>这是一行文字</p>
            <Button palette='primary'>button</Button>
        </Card>
    </div>;
}
