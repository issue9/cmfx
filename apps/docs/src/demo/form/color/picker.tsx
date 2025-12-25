// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    ColorPicker, ColorPickerPanelHSL, ColorPickerPanelOKLCH,
    ColorPickerPanelRGB, ColorPickerPanelTailwind, fieldAccessor, MountProps
} from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();
    const [Layout, layout] = layoutSelector('布局', 'horizontal');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    const color = fieldAccessor('color', 'oklch(1% 0.3 100)');

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Readonly />
            <Rounded />
            <Layout />
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
