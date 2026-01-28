// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Layout } from '@components/base';
import { FieldArea, FieldAreas } from '@components/form/field';

export interface TextFieldAreas extends FieldAreas {
    countArea?: FieldArea;
}

/**
 * 根据布局 l 生成通用的各个字段位置
 *
 * @param l - 布局方式；
 * @param hasHelp - 是否需要计算显示帮助信息的区域；
 * @param hasLabel - 是否需要计算标题区域；
 * @param hasCount - 是否需要计算显示计数信息的区域；
 */
export function calcLayoutFieldAreas(
    l: Layout, hasHelp?: boolean, hasLabel?: boolean, hasCount?: boolean
): TextFieldAreas {
    // NOTE: grid 中如果一个列或是行，即使其宽或是高度为 0，gap 也不会消失，
    // 所以得根据 layout 计算位置并填充多余的列。

    if (l === 'horizontal') { return calcHorizontalFieldAreas(hasHelp, hasLabel, hasCount); }
    return calcVerticalFieldAreas(hasHelp, hasLabel, hasCount);
}

function calcHorizontalFieldAreas(hasHelp?: boolean, hasLabel?: boolean, hasCount?: boolean): TextFieldAreas {
    if (hasLabel) {
        if (hasHelp) {
            if (hasCount) {
                return {
                    labelArea: { pos: 'top-start', rows: 2 }, // label 只需要与 input 横向对齐，所以 rows 应该保持与 input 一样。
                    inputArea: { pos: 'top-center', cols: 2, rows: 2 },
                    helpArea: { pos: 'bottom-center' },
                    countArea: { pos: 'bottom-end' },
                };
            }
            return {
                labelArea: { pos: 'top-start', rows: 2 }, // label 只需要与 input 横向对齐，所以 rows 应该保持与 input 一样。
                inputArea: { pos: 'top-center', cols: 2, rows: 2 },
                helpArea: { pos: 'bottom-center', cols: 2 },
            };
        }

        if (hasCount) {
            return {
                labelArea: { pos: 'top-start', rows: 3 },
                inputArea: { pos: 'top-center', rows: 3 },
                countArea: { pos: 'top-end', rows: 3 },
            };
        }
        return {
            labelArea: { pos: 'top-start', rows: 3 },
            inputArea: { pos: 'top-center', cols: 2, rows: 3 },
        };
    }

    if (hasHelp) {
        if (hasCount) {
            return {
                inputArea: { pos: 'top-start', cols: 3 },
                helpArea: { pos: 'bottom-start', cols: 2 },
                countArea: { pos: 'bottom-end' },
            };
        }
        return {
            inputArea: { pos: 'top-start', cols: 3, rows: 2 },
            helpArea: { pos: 'bottom-start', cols: 3 }
        };
    }

    if (hasCount) {
        return {
            inputArea: { pos: 'top-start', cols: 2, rows: 3 },
            countArea: { pos: 'top-end', rows: 3 },
        };
    }
    return { inputArea: { pos: 'top-start', cols: 3, rows: 3 } };
}

function calcVerticalFieldAreas(hasHelp?: boolean, hasLabel?: boolean, hasCount?: boolean): TextFieldAreas {
    if (hasLabel) {
        if (hasHelp) {
            if (hasCount) {
                return {
                    labelArea: { pos: 'top-start', cols: 3 },
                    inputArea: { pos: 'middle-start', cols: 3 },
                    helpArea: { pos: 'bottom-start', cols: 2 },
                    countArea: { pos: 'bottom-end' },
                };
            }
            return {
                labelArea: { pos: 'top-start', cols: 3 },
                inputArea: { pos: 'middle-start', cols: 3 },
                helpArea: { pos: 'bottom-start', cols: 3 }
            };
        }

        if (hasCount) {
            return {
                labelArea: { pos: 'top-start', cols: 2 },
                inputArea: { pos: 'middle-start', cols: 3, rows:2 },
                countArea: { pos: 'top-end' },
            };
        }
        return {
            labelArea: { pos: 'top-start', cols: 3 },
            inputArea: { pos: 'middle-start', cols: 3, rows: 2 },
        };
    }

    if (hasHelp) {
        if (hasCount) {
            return {
                inputArea: { pos: 'top-start', cols: 3 },
                helpArea: { pos: 'middle-start', cols: 2, rows: 2 },
                countArea: { pos: 'middle-end', rows: 2 }
            };
        }
        return {
            inputArea: { pos: 'top-start', cols: 3 },
            helpArea: { pos: 'middle-start', cols: 3, rows: 2 }
        };
    }

    if (hasCount) {
        return {
            inputArea: { pos: 'top-start', cols: 2, rows: 3 },
            countArea: { pos: 'top-end', rows: 3 }
        };
    }
    return { inputArea: { pos: 'top-start', cols: 3, rows: 3 } };
}
