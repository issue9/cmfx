// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { SchemeBuilder } from '@cmfx/components';

import { boolSelector, Demo, paletteSelector } from '../base';

export default function () {
    const [actionsS, actions] = boolSelector('actions', true);
    const [paletteS, palette] = paletteSelector();

    return <Demo settings={<>
        {paletteS}
        {actionsS}
    </>}>
        <SchemeBuilder actions={actions()} palette={palette()} />
    </Demo>;
}
