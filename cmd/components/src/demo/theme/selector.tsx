// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Colors, Scheme, SchemeSelector } from '@cmfx/components';

import { Demo, paletteSelector, Stage } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const schemes = new Map<string, Scheme>([
        ['default', {
            dark: {
                'primary-bg': '#333',
                'secondary-bg': '#666',
                'tertiary-bg': '#999',
                'surface-bg': '#bbb',
            } as Colors,
            light: {
                'primary-bg': '#bbb',
                'secondary-bg': '#999',
                'tertiary-bg': '#666',
                'surface-bg': '#333',
            } as Colors,
        }],
        ['default2', {
            dark: {
                'primary-bg': '#333bbb',
                'secondary-bg': '#666999',
                'tertiary-bg': '#999666',
                'surface-bg': '#bbb333',
            } as Colors,
            light: {
                'primary-bg': '#bbb333',
                'secondary-bg': '#999666',
                'tertiary-bg': '#666999',
                'surface-bg': '#333bbb',
            } as Colors,
        }]
    ]);

    return <Demo settings={<>
        { paletteS }
    </>}>
        <Stage title="default">
            <SchemeSelector palette={palette()} schemes={schemes} />
        </Stage>
    </Demo>;
}
