// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    ColorPanel, MountProps, ColorPickerPanelTailwind, ColorPickerPanelOKLCH, ColorPickerPanelHSL, ColorPickerPanelRGB
} from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <ColorPanel wcag="oklch(10% .5 .5)" palette={palette()} value='rgb(255 10 10)' pickers={[
            new ColorPickerPanelTailwind(),
            new ColorPickerPanelOKLCH(),
            new ColorPickerPanelHSL(),
            new ColorPickerPanelRGB(),
        ]}>
        </ColorPanel>
    </>;
}
