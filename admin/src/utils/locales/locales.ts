// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 管理本地化的相关内容
 */
export class Locales {
    #current: string;
    readonly #supported: Array<string>;

    /**
     * 构造函数
     * @param supported 支持的语言
     * @param curr 当前的语言，如果为空，按以下顺序获取默认值：
     *  - navigator.languages[0]；
     *  - 如果 navigator.languages[0] 也不在 supported 之中，则采用 supported[0] 作为默认值；
     */
    constructor(supported: Array<string>, curr?: string) {
        if (supported.length === 0) {
            throw 'supported 不能为空';
        }
        
        if (!curr) {
            if (navigator.languages) {
                curr = navigator.languages[0];
            }
            
            if (!supported.find((v)=>{return v === curr;})) {
                curr = supported[0];
            }
        }
        
        if (!supported.find((v) => { return v == curr; })) {
            throw 'curr 必须位于 supported 中';
        }

        this.#current = curr!;
        this.#supported = supported;
    }
    
    get supported(): Array<string> { return this.#supported; }

    set current(curr: string) {
        if (!this.#supported.find((v) => {
            return v == curr;
        })) {
            throw '不支持该语言';
        }
        this.#current = curr;
    }

    get current(): string { return this.#current; }

    /**
     * 根据 current 创建一个 Intl.DisplayNames 对象
     * @param type 需要显示的类型，同 Intl.DisplayNames 构建函数中的 options.type 字段。
     */
    displayNames(type: 'language' | 'region' | 'script' | 'currency' | 'calendar' | 'dateTimeField') {
        return new Intl.DisplayNames([this.current], {type});
    }

    /**
     * 返回支持列表在当前语言下的名称
     */
    supportedNames(): Map<string, string> {
        const dn = this.displayNames('language');

        const maps = new Map<string, string>();
        this.supported.forEach((v)=>{ maps.set(v, dn.of(v)!); });
        return maps;
    }
}
