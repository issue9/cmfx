// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { FieldAccessor, OKLCHPanel } from '@cmfx/components';

import { Demo, layoutSelector, Stage } from '../base';

export default function() {
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const color = FieldAccessor('color', 'oklch(1% 0.3 100)');

    return <Demo settings={
        <>
            {layoutS}
        </>
    }>
        <Stage title='panel'>
            <OKLCHPanel accessor={color} />
        </Stage>
    </Demo>;
}