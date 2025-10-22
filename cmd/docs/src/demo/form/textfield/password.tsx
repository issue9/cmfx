// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Password } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function() {
    const pwd = fieldAccessor('name', 'pwd');

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        {readonlyS}
        {roundedS}
        {disabledS}
        {layoutS}
        <button class="palette--primary" onClick={() => {
            pwd.setError(pwd.getError() ? undefined : 'error');
        }}>toggle error</button>

        <Password hasHelp layout={layout()} placeholder='placeholder' label="password"
            prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
            rounded={rounded()} readonly={readonly()} accessor={pwd} />
    </div>;
}
