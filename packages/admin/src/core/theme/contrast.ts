// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Config } from '@/core/config';

export const contrasts = ['nopreference', 'less', 'more'] as const;

const key = 'theme_contrast';

/**
 * 对比度，可用的取值为 {@link contrasts}
 *
 * https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
 */
export type Contrast = typeof contrasts[number];

export function getContrast(conf: Config, preset: Contrast) {
    let c = conf.get<Contrast>(key);
    if (!c) {
        c = preset;
    } else if (contrasts.indexOf(c) < 0) {
        console.warn(`从 conf 读取的 ${key} 值 ${c} 不符合要求！`);
        c = 'nopreference';
    }
    return c;
}

/**
 * 调整对比度
 */
export function changeContrast(conf: Config, c: Contrast) {
    const l = contrastLuminance.get(c)!;
    document.documentElement.style.setProperty('--lightness', l.toString());
    conf.set(key, c);
}

const contrastLuminance = new Map<Contrast, number>([
    ['less', .7],
    ['nopreference', .9],
    ['more', 1],
]);
