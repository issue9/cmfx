// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Layout } from '@/base';
import type { FieldArea, FieldAreas } from '@/form/field';

type RangeAreas = FieldAreas & {
    valueArea?: FieldArea;
};

/**
 * 根据布局 l 生成通用的各个字段位置
 *
 * @param l - 布局方式；
 * @param hasHelp - 是否需要计算显示帮助信息的区域；
 * @param hasLabel - 是否需要计算标题区域；
 * @param hasValue - 是否需要计算显示值的区域；
 */
export function calcLayoutFieldAreas(l: Layout, hasHelp: boolean, hasLabel: boolean, hasValue: boolean): RangeAreas {
    if (l === 'horizontal') { return calcHorizontalFieldAreas(hasHelp, hasLabel, hasValue); }
    return calcVerticalFieldAreas(hasHelp, hasLabel, hasValue);
}

function  calcHorizontalFieldAreas(hasHelp: boolean, hasLabel: boolean, hasValue: boolean): RangeAreas {
    if (hasLabel) {
        if (hasHelp) {
            return {
                labelArea: { pos: 'top-left' }, // label 只需要与 input 横向对齐，所以 rows 应该保持与 input 一样。
                inputArea: { pos: 'top-center', cols: hasValue ? 1 : 2 }, // 右边一格用于显示值
                helpArea: { pos: 'middle-center', cols: 2, rows: 2 },
                valueArea: hasValue ? { pos: 'top-right' } : undefined
            };
        }

        return {
            labelArea: { pos: 'top-left', rows: 3 },
            inputArea: { pos: 'top-center', cols: hasValue ? 1 : 2, rows: 3 },
            valueArea: hasValue ? { pos: 'top-right' } : undefined
        };
    }

    if (hasHelp) {
        return {
            inputArea: { pos: 'top-left', cols: hasValue ? 2 : 3 },
            helpArea: { pos: 'middle-left', cols: 3, rows: 2 },
            valueArea: hasValue ? { pos: 'top-right' } : undefined
        };
    }

    return {
        inputArea: { pos: 'top-left', cols: hasValue ? 2 : 3, rows: 3 },
        valueArea: hasValue ? { pos: 'top-right' } : undefined
    };
}

function  calcVerticalFieldAreas(hasHelp: boolean, hasLabel: boolean, hasValue: boolean): RangeAreas {
    if (hasLabel) {
        if (hasHelp) {
            return {
                labelArea: { pos: 'top-left', cols: hasValue ? 2 : 3 }, // 最右格用于显示值
                inputArea: { pos: 'middle-left', cols: 3 },
                helpArea: { pos: 'bottom-left', cols: 3 },
                valueArea: hasValue ? { pos: 'top-right' } : undefined
            };
        }

        return {
            labelArea: { pos: 'top-left', cols: hasValue ? 2 : 3 },
            inputArea: { pos: 'middle-left', cols: 3, rows: 2 },
            valueArea: hasValue ? { pos: 'top-right' } : undefined
        };
    }

    if (hasHelp) {
        return {
            inputArea: { pos: 'top-left', cols: hasValue ? 2 : 3 },
            helpArea: { pos: 'middle-left', cols: 3, rows: 2 },
            valueArea: hasValue ? { pos: 'top-right' } : undefined,
        };
    }

    return {
        inputArea: { pos: 'top-left', cols: hasValue ? 2 : 3, rows: 3 },
        valueArea: hasValue ? { pos: 'top-right' } : undefined,
    };
}
