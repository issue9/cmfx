// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

export const contrasts = ['nopreference', 'less', 'more'] as const;

/**
 * 对比度，可用的取值为 {@link contrasts}
 *
 * https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
 */
export type Contrast = typeof contrasts[number];

/**
 * 调整对比度
 */
export function changeContrast(elem: HTMLElement, c: Contrast) {
    const l = contrastValues.get(c)!;
    elem.style.setProperty('--lightness', l.toString());
}

export const contrastValues = new Map<Contrast, number>([
    ['less', .7],
    ['nopreference', .9],
    ['more', 1],
]);
