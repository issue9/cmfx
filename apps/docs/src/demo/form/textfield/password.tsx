// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Password, MountProps, Button } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const pwd = fieldAccessor('name', 'pwd');

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [paletteS, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {readonlyS}
            {roundedS}
            {disabledS}
            {layoutS}
            <Button palette="primary" onclick={() => {
                pwd.setError(pwd.getError() ? undefined : 'error');
            }}>toggle error</Button>
        </Portal>

        <Password hasHelp layout={layout()} placeholder='placeholder' label="password"
            prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
            rounded={rounded()} readonly={readonly()} accessor={pwd} />
    </div>;
}
