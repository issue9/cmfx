// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

export interface AfterWrite2Clipboard {
    /**
     * @param ok - 是否写入成功；
     * @param text - 写入的文本；
     */
    (ok?: boolean, text?: string): void;
}

/**
 * 将内容 text 写入剪切板
 *
 * @param text - 写入的文本，可以是字符串或是一个返回字符串的方法；
 * @param after - 写入完成之后执行的操作；
 */
export async function write2Clipboard(text: string | { (): string; }, after?: AfterWrite2Clipboard): Promise<void> {
    let t: string;
    switch (typeof text) {
    case 'string':
        t = text;
        break;
    case 'function':
        t = text();
        break;
    default:
        throw '参数 text 的类型无效';
    }

    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(t);
        } else if (after) {
            after(false, t);
            return;
        }
    } catch (err) {
        if (after) {
            console.error(err);
            after(false, t);
            return;
        }
    }

    if (after) {
        after(true, t);
    }
}
