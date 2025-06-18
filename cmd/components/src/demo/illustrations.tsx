// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { illustrations, modes, ThemeProvider } from '@cmfx/components';

import { arraySelector, Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [modeS, mode] = arraySelector('mode', modes, 'system');
    
    return <Demo settings={<>
        {paletteS}
        {modeS}
    </>}>
        <ThemeProvider mode={mode()}>
            <Stage title="400" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error400 palette={palette()} />
            </Stage>

            <Stage title="401" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error401 palette={palette()} />
            </Stage>

            <Stage title="403" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error403 palette={palette()} />
            </Stage>

            <Stage title="404" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error404 palette={palette()} />
            </Stage>

            <Stage title="429" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error429 palette={palette()} />
            </Stage>

            <Stage title="500" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error500 palette={palette()} />
            </Stage>

            <Stage title="503" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error503 palette={palette()} />
            </Stage>

            <Stage title="504" class="w-70 p-4 bg-palette-bg">
                <illustrations.Error504 palette={palette()} />
            </Stage>

            <Stage title="bug" class="w-70 p-4 bg-palette-bg">
                <illustrations.BUG palette={palette()} />
            </Stage>

            <Stage title="building" class="w-70 p-4 bg-palette-bg">
                <illustrations.Building palette={palette()} />
            </Stage>
        </ThemeProvider>
    </Demo>;
}