// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const contrasts = ['nopreference', 'less', 'more'] as const;

const key = 'theme_contrast';

/**
 * 对比度，可用的取值为 {@link contrasts}
 *
 * https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
 */
export type Contrast = typeof contrasts[number];

export function getContrast(preset: Contrast): Contrast {
    const c = (localStorage.getItem(key) ?? preset) as Contrast;
    if (contrasts.indexOf(c) < 0) {
        console.log(`从 localStorage 读取的 ${key} 值 ${c} 不符合要求！`);
        return 'nopreference';
    }
    return c;
}

/**
 * 调整对比度
 */
export function changeContrast(c: Contrast) {
    const l = contrastLuminance.get(c)!;
    document.documentElement.style.setProperty('--contrast', l.toString());
    localStorage.setItem(key, c);
}

const contrastLuminance = new Map<Contrast, number>([
    ['less', 70],
    ['nopreference', 90],
    ['more', 100],
]);
