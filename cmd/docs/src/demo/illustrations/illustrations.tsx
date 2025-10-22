// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, modes, ThemeProvider } from '@cmfx/components';
import * as illustrations from '@cmfx/illustrations';
import { createEffect, createSignal } from 'solid-js';

import { arraySelector, boolSelector, paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [modeS, mode] = arraySelector('mode', modes, 'system');
    const [customS, custom] = boolSelector('自定义文字内容', false);
    const [scaleS, scale] = boolSelector('缩放', false);

    const [cls, setCls] = createSignal(joinClass(undefined, scale() ? 'w-200' : 'w-150', 'p-4', 'bg-palette-bg'));
    createEffect(() => {
        setCls(joinClass(undefined, scale() ? 'w-200' : 'w-150', 'p-4', 'bg-palette-bg'));
    });

    return <div>
        {paletteS}
        {modeS}
        {customS}
        {scaleS}

        <ThemeProvider mode={mode()}>
            <div class='flex flex-wrap gap-5'>
                <div title='400' class={cls()}>
                    <illustrations.Error400 palette={palette()} text={custom() ? '自定义错误信息' : undefined} />
                </div>

                <div title="401" class={cls()}>
                    <illustrations.Error401 palette={palette()} text={custom() ? '未验证的登录信息' : undefined} />
                </div>

                <div title="403" class={cls()}>
                    <illustrations.Error403 palette={palette()} text={custom() ? '禁 止 访 问' : undefined} />
                </div>

                <div title="404" class={cls()}>
                    <illustrations.Error404 palette={palette()} text={custom() ? '页面未找到' : undefined} />
                </div>

                <div title="429" class={cls()}>
                    <illustrations.Error429 palette={palette()} text={custom() ? '请求过多' : undefined} />
                </div>

                <div title="500" class={cls()}>
                    <illustrations.Error500 palette={palette()} text={custom() ? '服务器错误' : undefined} />
                </div>

                <div title="503" class={cls()}>
                    <illustrations.Error503 palette={palette()} text={custom() ? '服 务 暂 不 可 用' : undefined} />
                </div>

                <div title="504" class={cls()}>
                    <illustrations.Error504 palette={palette()} text={custom() ? '网 关 超 时' : undefined} />
                </div>

                <div title="bug" class={cls()}>
                    <illustrations.BUG palette={palette()} />
                </div>

                <div title="building" class={cls()}>
                    <illustrations.Building palette={palette()} text={custom() ? '升级中...' : undefined} />
                </div>

                <div title="login" class={cls()}>
                    <illustrations.Login palette={palette()} text={custom() ? '欢迎回来' : undefined} />
                </div>
            </div>
        </ThemeProvider>
    </div>;
}
