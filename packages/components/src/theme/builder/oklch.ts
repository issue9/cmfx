// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { rand } from '@cmfx/core';
import Color from 'colorjs.io';

export function randColor(h: number, typ?: 'low' | 'high'): [light: Color, dark: Color] {
    let light: Color;
    let dark: Color;
    switch (typ) {
    case 'low':
        light = new Color('oklch', [rand(.955, .965, 3), rand(.165, .175, 3), h]);
        dark = new Color(light.clone().darken(.55));
        dark.c = rand(0.039, 0.044, 3);
        return [light, dark];
    case 'high':
        light = new Color('oklch', [rand(.555, .650, 3), rand(.20, .35, 3), h]);
        dark = new Color(light.clone().darken(.60));
        dark.c = rand(0.038, 0.043, 3);
        return [light, dark];
    default:
        light = new Color('oklch', [rand(.855, .865, 3), rand(.20, .25, 3), h]);
        dark = new Color(light.clone().darken(.65));
        dark.c = rand(0.037, 0.042, 3);
        return [light, dark];
    }
}
