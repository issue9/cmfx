// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 将内容 text 写入剪切板
 *
 * @param text 写入的文本，可以是字符串或是一个返回字符串的方法；
 * @param after 写入完成之后执行的操作；
 */
export async function write2Clipboard(text: string | { (): string; }, after?: { (text: string): void; }): Promise<void> {
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

    await navigator.clipboard.writeText(t);

    if (after) {
        after(t);
    }
}
