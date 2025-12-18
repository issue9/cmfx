// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

interface Options {
    localeMatcher?: 'lookup' | 'best fit';
}

/**
 * 从 availables 中查找最符合 requested 的语言 ID
 *
 * @param requested - 匹配的值；
 * @param availables - 被匹配的列表；
 * @param preset - 默认值，未找到时采用此值返回；
 * @param options - 可用的选项，只有一个字段 localeMatcher，该字段有以下两种取值：
 *  - lookup；
 *  - best fit；
 * 默认值为 lookup。
 */
export function match(requested: string, availables: Readonly<Array<string>>, preset: string, options: Options = {}): string {
    let ret = availables.find(v => Intl.getCanonicalLocales(v)[0] === Intl.getCanonicalLocales(requested)[0]);
    if (ret) { return ret; }

    if (options.localeMatcher === 'lookup') {
        return ret || preset;
    }else if (options.localeMatcher === 'best fit') {
        const rl = new Intl.Locale(Intl.getCanonicalLocales([requested])[0]);
        let best: string = ''; // 当前最匹配的值
        let bestValue = 0; // 匹配程度，越高越匹配。

        for (const a of availables) {
            const al = new Intl.Locale(Intl.getCanonicalLocales(a)[0]); // 不能直接转换整个 availables，需要保证元素项的值不变。

            if ((al.baseName === rl.baseName) && bestValue < 6) {
                best = a;
                bestValue = 6; // baseName = language ["-" script] ["-" region] *("-" variant)
            } else if ((al.language === rl.language && al.script === rl.script && al.region === rl.region) && bestValue < 5) {
                best = a;
                bestValue = 5;
            } else if ((al.language === rl.language && al.region === rl.region) && bestValue < 4) {
                best = a;
                bestValue = 4;
            } else if ((al.language === rl.language && al.script === rl.script) && bestValue < 3) {
                best = a;
                bestValue = 3;
            } else if ((al.language === rl.language) && bestValue < 2) {
                best = a;
                bestValue = 2;
            }  else if ((al.region === rl.region) && bestValue < 1) {
                best = a;
                bestValue = 1;
            }
        }

        if (best) {
            return best;
        }
    }

    return ret || preset;
}
