// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, badgeCorners, Button } from '@cmfx/components';
import { For } from 'solid-js';

import { Demo, paletteSelector, Stage } from './base';

export default function () {
    const [paletteS, palette] = paletteSelector();

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Stage title="基本用法" class="flex items-start">
            <For each={badgeCorners}>
                {(pos) => (
                    <Badge pos={pos} palette={palette()}>
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </Stage>

        <Stage title="带内容" class="flex items-start">
            <For each={badgeCorners}>
                {(pos) => (
                    <Badge pos={pos} palette={palette()} text="99+">
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </Stage>

        <Stage title="长内容" class="flex items-start">
            <For each={badgeCorners}>
                {(pos) => (
                    <Badge pos={pos} palette={palette()} text="这是一段很长的文字内容">
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </Stage>
    </Demo>;
}
