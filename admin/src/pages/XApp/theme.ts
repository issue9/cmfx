// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Hct, MaterialDynamicColors, SchemeTonalSpot, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import { ThemeDefinition } from 'vuetify';

import { Contrast } from '@/core';

/**
 * 根据参数生成符合 vuetify 的主题
 */
export function buildTheme(dark: boolean, contrast: Contrast, primary: string): ThemeDefinition {
    let c = 0.0;
    switch (contrast) {
    case Contrast.Medium:
        c = 0.5;
        break;
    case Contrast.High:
        c = 1.0;
        // TODO c = -1.0
    }
    const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(primary)), dark, c);

    return {
        dark: dark,
        colors: {
            background: hexFromArgb(MaterialDynamicColors.background.getArgb(scheme)),
            primary: hexFromArgb(MaterialDynamicColors.primary.getArgb(scheme)),
            surface: hexFromArgb(MaterialDynamicColors.surface.getArgb(scheme)),
            secondary: hexFromArgb(MaterialDynamicColors.secondary.getArgb(scheme)),
            //success: ,
            //warning: ,
            error: hexFromArgb(MaterialDynamicColors.error.getArgb(scheme)),
            //info: ,
            'on-background': hexFromArgb(MaterialDynamicColors.onBackground.getArgb(scheme)),
            'on-primary': hexFromArgb(MaterialDynamicColors.onPrimary.getArgb(scheme)),
            'on-surface': hexFromArgb(MaterialDynamicColors.onSurface.getArgb(scheme)),
            'on-secondary': hexFromArgb(MaterialDynamicColors.onSecondary.getArgb(scheme)),
            //'on-success': ,
            //'on-warning': ,
            'on-error': hexFromArgb(MaterialDynamicColors.onError.getArgb(scheme)),
            //'on-info':
        }
    };
}
