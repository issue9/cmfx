// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const contrasts = ['nopreference', 'less', 'more'] as const;

/**
 * 对比度，可用的取值为 {@link contrasts}
 *
 * https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
 */
export type Contrast = typeof contrasts[number];

export function initContrast(preset: Contrast) {
    // TODO
}

export function changeContrast(c: Contrast) {
    // TODO
}
