// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { illustrations, joinClass, modes, ThemeProvider } from '@cmfx/components';

import { arraySelector, Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [modeS, mode] = arraySelector('mode', modes, 'system');
    
    return <Demo settings={<>
        {paletteS}
        {modeS}
    </>}>
        <ThemeProvider mode={mode()}>
            <div class={joinClass(palette() ? `palette--${palette()}` : undefined, 'flex flex-wrap gap-5')}>
                <Stage title="400" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error400 />
                </Stage>

                <Stage title="401" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error401 />
                </Stage>

                <Stage title="403" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error403 />
                </Stage>

                <Stage title="404" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error404 />
                </Stage>

                <Stage title="429" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error429 />
                </Stage>

                <Stage title="500" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error500 />
                </Stage>

                <Stage title="503" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error503 />
                </Stage>

                <Stage title="504" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Error504 />
                </Stage>

                <Stage title="bug" class="w-70 p-4 bg-palette-bg">
                    <illustrations.BUG />
                </Stage>

                <Stage title="building" class="w-70 p-4 bg-palette-bg">
                    <illustrations.Building />
                </Stage>
            </div>
        </ThemeProvider>
    </Demo>;
}