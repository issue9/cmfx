// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Palettes, Scheme, SchemeSelector } from '@cmfx/components';

import { Demo, paletteSelector, Stage } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const schemes = new Map<string, Scheme>([
        ['default', {
            contrast: 85,
            dark: {
                'primary-bg': '#333',
                'secondary-bg': '#666',
                'tertiary-bg': '#999',
                'surface-bg': '#bbb',
            } as Palettes,
            light: {
                'primary-bg': '#bbb',
                'secondary-bg': '#999',
                'tertiary-bg': '#666',
                'surface-bg': '#333',
            } as Palettes,
        }],
        ['default2', {
            contrast: 65,
            dark: {
                'primary-bg': '#333bbb',
                'secondary-bg': '#666999',
                'tertiary-bg': '#999666',
                'surface-bg': '#bbb333',
            } as Palettes,
            light: {
                'primary-bg': '#bbb333',
                'secondary-bg': '#999666',
                'tertiary-bg': '#666999',
                'surface-bg': '#333bbb',
            } as Palettes,
        }]
    ]);

    return <Demo settings={<>
        {paletteS}
    </>}>
        <Stage title="default">
            <SchemeSelector value='default' palette={palette()} schemes={schemes} />
        </Stage>
    </Demo>;
}
