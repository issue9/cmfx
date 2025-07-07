// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { rand } from '@cmfx/core';
import Color from 'colorjs.io';

/**
 * 生成随机的 oklch 颜色值
 *
 * @param hue 色相，取值范围 [0, 360]；
 * @param wcag WCAG 值，取值范围 [0, 100]；
 * - 75 对应 WCAG2 7:1
 * - 60 对应 WCAG2 4.5:1
 * - 45 对应 WCAG2 3:1
 */
export function randOklchColor(hue: number, wcag?: number, typ?: 'low' | 'high'): [light: Color, dark: Color] {
    let light: Color;
    let dark: Color;

    switch (typ) {
    case 'low':
        light = new Color('oklch', [rand(.955, .965, 3), rand(.165, .175, 3), hue]);
        dark = new Color(light.clone().darken(.55));
        dark.c = rand(0.039, 0.044, 3);
        break;
    case 'high':
        light = new Color('oklch', [rand(.555, .650, 3), rand(.20, .35, 3), hue]);
        dark = new Color(light.clone().darken(.60));
        dark.c = rand(0.038, 0.043, 3);
        break;
    default:
        light = new Color('oklch', [rand(.855, .865, 3), rand(.20, .25, 3), hue]);
        dark = new Color(light.clone().darken(.65));
        dark.c = rand(0.037, 0.042, 3);
    }

    if (wcag) {
        let apca = Math.abs(light.contrastAPCA(dark));
        while (apca < wcag && dark.l <= 1) {
            dark.l -= .01;
            apca = Math.abs(light.contrastAPCA(dark));
            console.log(dark.l, apca);
        }
    }


    return [light, dark];
}
