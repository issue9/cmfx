// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { illustrations, joinClass, modes, ThemeProvider } from '@cmfx/components';

import { arraySelector, boolSelector, Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [modeS, mode] = arraySelector('mode', modes, 'system');
    const [customS, custom] = boolSelector('自定义文字内容', false);

    return <Demo settings={<>
        {paletteS}
        {modeS}
        {customS}
    </>}>
        <ThemeProvider mode={mode()}>
            <div class={joinClass(palette() ? `palette--${palette()}` : undefined, 'flex flex-wrap gap-5')}>
                <Stage title="400" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error400 />
                </Stage>

                <Stage title="401" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error401 />
                </Stage>

                <Stage title="403" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error403 />
                </Stage>

                <Stage title="404" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error404 />
                </Stage>

                <Stage title="429" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error429 />
                </Stage>

                <Stage title="500" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error500 />
                </Stage>

                <Stage title="503" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error503 />
                </Stage>

                <Stage title="504" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Error504 />
                </Stage>

                <Stage title="bug" class="w-150 p-4 bg-palette-bg">
                    <illustrations.BUG />
                </Stage>

                <Stage title="building" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Building title={custom() ? '升级中...' : undefined} />
                </Stage>

                <Stage title="login" class="w-150 p-4 bg-palette-bg">
                    <illustrations.Login text={custom() ? "欢迎回来" : undefined} />
                </Stage>
            </div>
        </ThemeProvider>
    </Demo>;
}