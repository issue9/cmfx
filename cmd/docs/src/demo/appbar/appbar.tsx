// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Button } from '@cmfx/components';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        <Appbar palette={palette()} title="title" logo="LOGO" actions={
            <>
                <Button square><IconEye /></Button>
                <Button square><IconEye /></Button>
            </>
        }>
            <IconEye />
        </Appbar>
    </div>;
}
