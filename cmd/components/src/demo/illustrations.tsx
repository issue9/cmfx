// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { illustrations, joinClass, modes, ThemeProvider } from '@cmfx/components';

import { createEffect, createSignal } from 'solid-js';
import { arraySelector, boolSelector, Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [modeS, mode] = arraySelector('mode', modes, 'system');
    const [customS, custom] = boolSelector('自定义文字内容', false);
    const [scaleS, scale] = boolSelector('缩放', false);

    const [cls, setCls] = createSignal(joinClass(scale() ? 'w-200' : 'w-150', 'p-4', 'bg-palette-bg'));
    createEffect(() => {
        setCls(joinClass(scale() ? 'w-200' : 'w-150', 'p-4', 'bg-palette-bg'));
    });

    return <Demo settings={<>
        {paletteS}
        {modeS}
        {customS}
        {scaleS}
    </>}>
        <ThemeProvider mode={mode()}>
            <div class={joinClass(palette() ? `palette--${palette()}` : undefined, 'flex flex-wrap gap-5')}>
                <Stage title='400' class={cls()}>
                    <illustrations.Error400 text={custom() ? '自定义错误信息' : undefined} />
                </Stage>

                <Stage title="401" class={cls()}>
                    <illustrations.Error401 text={custom() ? '未验证的登录信息' : undefined} />
                </Stage>

                <Stage title="403" class={cls()}>
                    <illustrations.Error403 text={custom() ? '禁 止 访 问' : undefined} />
                </Stage>

                <Stage title="404" class={cls()}>
                    <illustrations.Error404 text={custom() ? '页面未找到' : undefined} />
                </Stage>

                <Stage title="429" class={cls()}>
                    <illustrations.Error429 text={custom() ? '请求过多' : undefined} />
                </Stage>

                <Stage title="500" class={cls()}>
                    <illustrations.Error500 text={custom() ? '服务器错误' : undefined} />
                </Stage>

                <Stage title="503" class={cls()}>
                    <illustrations.Error503 text={custom() ? '服 务 暂 不 可 用' : undefined} />
                </Stage>

                <Stage title="504" class={cls()}>
                    <illustrations.Error504 text={custom() ? '网 关 超 时' : undefined} />
                </Stage>

                <Stage title="bug" class={cls()}>
                    <illustrations.BUG />
                </Stage>

                <Stage title="building" class={cls()}>
                    <illustrations.Building text={custom() ? '升级中...' : undefined} />
                </Stage>

                <Stage title="login" class={cls()}>
                    <illustrations.Login text={custom() ? '欢迎回来' : undefined} />
                </Stage>
            </div>
        </ThemeProvider>
    </Demo>;
}
