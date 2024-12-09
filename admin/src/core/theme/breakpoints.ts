// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Breakpoint, breakpointsOrder } from '../../../tailwind.preset.ts';
export { breakpoints, breakpointsMedia, breakpointsOrder } from '../../../tailwind.preset.ts';
export type { Breakpoint } from '../../../tailwind.preset.ts';

/**
 * 比较两个 Breakpoint 的大小
 *
 * - 0 表示相待；
 *  > 0 表示 v1 > v2；
 *  < 0 表示 v1 < v2；
 */
export function compareBreakpoint(v1?: Breakpoint, v2?: Breakpoint): number {
    if (v1 === v2) { return 0; }
    if (v1 === undefined) { return -1; }
    if (v2 === undefined) { return 1; }
    return breakpointsOrder.indexOf(v1) - breakpointsOrder.indexOf(v2);
}
