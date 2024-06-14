// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { match } from '@formatjs/intl-localematcher';

interface AfterLocaleChange {
    /**
     * 在改变语言时触发的事件
     *
     * @param matched: 从 supported 中找到的与 orign 最匹配的语言标签，可能与 orign 有一定差别；
     * @param origin 客户想要的原始语言标签；
     * @param old 改变之前的值；
     * @param fallback 设定的默认值；
     */
    (matched: string, origin?: string, old?: string, fallback?: string): void
}

/**
 * 管理本地化的相关内容
 */
export class Locales {
    readonly #fallback: string;
    readonly #supported: Array<string>;
    readonly #afterLocaleChange: Array<AfterLocaleChange>;
    #current: string;

    /**
     * 构造函数
     * @param supported 支持的语言；
     * @param fallback 默认语言在 supported 中的索引；
     * @param curr 当前的语言，如果为空，按以下顺序获取默认值：
     *  - navigator.languages[0]；
     *  - 如果 navigator.languages[0] 也不在 supported 之中，则采用 supported[0] 作为默认值；
     */
    constructor(supported: Array<string>, fallback: number, curr?: string) {
        if (supported.length === 0) {
            throw 'supported 不能为空';
        }

        if (!curr) {
            curr = navigator.languages ? navigator.languages[0] : supported[0];
        }

        this.#fallback = supported[fallback];
        this.#supported = supported;
        this.#current = match([curr], supported, this.#fallback);
        this.#afterLocaleChange = [];
    }

    get supported(): Array<string> { return this.#supported; }

    set current(curr: string) {
        const old = this.current;
        this.#current = match([curr], this.supported, this.#fallback);
        this.#afterLocaleChange.map((v) => {
            v(this.current, curr, old, this.fallback);
        });
    }

    get current(): string { return this.#current; }

    get fallback(): string { return this.#fallback; }

    /**
     * 注册一个在 current 的值改变时触发的方法
     */
    afterChange(event: AfterLocaleChange) { this.#afterLocaleChange.push(event); }

    /**
     * 根据 current 创建一个 Intl.DisplayNames 对象
     * @param type 需要显示的类型，同 Intl.DisplayNames 构建函数中的 options.type 字段。
     */
    displayNames(type: 'language' | 'region' | 'script' | 'currency' | 'calendar' | 'dateTimeField') {
        return new Intl.DisplayNames([this.current], { type });
    }

    /**
     * 返回支持列表在当前语言下的名称
     */
    supportedNames(): Map<string, string> {
        const dn = this.displayNames('language');

        const maps = new Map<string, string>();
        this.supported.forEach((v) => { maps.set(v, dn.of(v)!); });
        return maps;
    }
}
