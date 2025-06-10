// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { FieldAccessor, OKLCHPanel, OKLCHPicker } from '@cmfx/components';

import { boolSelector, Demo, layoutSelector, Stage } from '../base';

export default function() {
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [roundedS, rounded] = boolSelector('rounded');

    const color = FieldAccessor('color', 'oklch(1% 0.3 100)');

    return <Demo settings={
        <>
            {layoutS}
            {roundedS}
        </>
    }>
        <Stage title='panel'>
            <OKLCHPanel accessor={color} />
        </Stage>
        
        <Stage title='picker'>
            <OKLCHPicker layout={layout()} accessor={color} label='picker label' rounded={rounded()} />
        </Stage>
    </Demo>;
}