// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale } from '@cmfx/core';

const kb = 1024;
const mb = kb * 1024;
const gb = mb * 1024;
const tb = gb * 1024;
const pb = tb * 1024;

/**
 * 创建用于格式化字节大小的函数
 *
 * @param l - 本地化接口；
 * @returns 用于格式化的函数，会根据传入的字节大小自动选择合适的单位；
 */
export function createBytesFormatter(l: Locale): {(byte: number): string} {
    let style: Intl.NumberFormatOptions['unitDisplay'];

    switch (l.displayStyle) {
    case 'full':
        style = 'long';
        break;
    case 'short':
        style = 'short';
        break;
    case 'narrow':
        style = 'narrow';
        break;
    default:
        style = 'short';
        console.error('参数 u 的类型无效');
    }
    const b = l.numberFormat({ style: 'unit', unit: 'byte', unitDisplay: style });
    const k = l.numberFormat({ style: 'unit', unit: 'kilobyte', unitDisplay: style });
    const m = l.numberFormat({ style: 'unit', unit: 'megabyte', unitDisplay: style });
    const g = l.numberFormat({ style: 'unit', unit: 'gigabyte', unitDisplay: style });
    const t = l.numberFormat({ style: 'unit', unit: 'terabyte', unitDisplay: style });
    const p = l.numberFormat({ style: 'unit', unit: 'petabyte', unitDisplay: style });

    return (bytes: number): string => {
        if (bytes < kb) {
            return b.format(bytes);
        } else if (bytes < mb) {
            return k.format(bytes / kb);
        } else if (bytes < gb) {
            return m.format(bytes / mb);
        } else if (bytes < tb) {
            return g.format(bytes / gb);
        } else if (bytes < pb) {
            return t.format(bytes / tb);
        } else {
            return p.format(bytes / pb);
        }
    };
}
