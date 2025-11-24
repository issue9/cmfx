// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    fieldAccessor, ColorPicker, MountProps, ColorPickerPanelTailwind, ColorPickerPanelOKLCH, ColorPickerPanelHSL, ColorPickerPanelRGB
} from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [roundedS, rounded] = boolSelector('rounded');
    const [paletteS, palette] = paletteSelector();
    const [readonlyS, readonly] = boolSelector('readonly');
    const [disabledS, disabled] = boolSelector('disabled');

    const color = fieldAccessor('color', 'oklch(1% 0.3 100)');

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {layoutS}
            {roundedS}
            {readonlyS}
            {disabledS}
        </Portal>

        <ColorPicker readonly={readonly()} disabled={disabled()} wcag='oklch(1 0 0)' palette={palette()} layout={layout()}
            accessor={color} label='picker label' rounded={rounded()} pickers={[
                new ColorPickerPanelTailwind(),
                new ColorPickerPanelOKLCH(),
                new ColorPickerPanelHSL(),
                new ColorPickerPanelRGB(),
            ]}
        />
    </>;
}
