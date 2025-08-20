// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { rand } from '@cmfx/core';
import Color from 'colorjs.io';

/**
 * 生成随机的 oklch 颜色值
 *
 * @param hue - 色相，取值范围 [0, 360]；
 * @param contrast - 基于 APCA 的对比度，取值范围 [0, 100]：
 * - 75 对应 WCAG2 7:1
 * - 60 对应 WCAG2 4.5:1
 * - 45 对应 WCAG2 3:1
 */
export function randOklchColor(hue: number, contrast: 75 | 60 | 45 = 60, typ?: 'low' | 'high'): [light: Color, dark: Color] {
    switch (typ) {
    case 'high':
        const hl = new Color('oklch', [rand(.955, .965, 3), rand(.065, .175, 3), hue]);
        const hd = new Color(hl.clone().darken(.55));
        return [hl, hd];
    case 'low':
        const ll = new Color('oklch', [rand(.555, .655, 3), rand(.020, .15, 3), hue]);
        const ld = new Color(ll.clone().darken(.30));
        return [ll, ld];
    default:
        const l = new Color('oklch', [rand(.875, .885, 3), rand(.20, .25, 3), hue]);
        const d = new Color(l.clone().darken(.65));

        for (let apca = Math.abs(l.contrastAPCA(d)); apca < contrast && d.l > 0; apca = Math.abs(l.contrastAPCA(d))) {
            d.l -= .01;
        }
        return [l, d];
    }
}
