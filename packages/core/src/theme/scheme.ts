// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 定义主题中与颜色相关的变量
 *
 * 各个字段与 theme.css 中的同名的变量对应。
 */
export interface Scheme {
    primary: number;
    secondary?: number;
    tertiary?: number;
    surface?: number;
    error?: number;
}

/**
 * 改变主题色
 *
 * 此方法提供了动态改变主题色的方法，发生在 theme.css 应用之后。
 */
export function changeScheme(elem: HTMLElement, s?: Scheme) {
    if (!s) { return; }

    Object.entries(s).forEach((o)=>{
        if (o[1] !== undefined) {
            elem.style.setProperty('--'+o[0], o[1]);
        }
    });

    /*
     * 将 :root 中所有的变量复制到当前元素中
     * 因为部分变量本身又引用了其它变量，为了重新计算这些变量，需要将未计算的变量值复制到当前元素。
     */
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText === ':root') {
                    Object.entries(rule.style).forEach(([_, key]) => {
                        if (!key.startsWith('--') || key.startsWith('--bg') || key.startsWith('--fg')) {
                            return;
                        }

                        if (!elem.style.getPropertyValue(key)) { // 如果已经存在，说明上面的 Object.entries.foreach 已经设置过了。
                            elem.style.setProperty(key, rule.style.getPropertyValue(key));
                        }
                    });
                }
            }
        }
    }
}

export function genScheme(primary: number, error?: number, step = 60): Scheme {
    if (step > 180) {
        throw '参数 step 不能大于 180';
    }

    let inc = (): number => {
        primary += step;
        if (primary > 360) {
            primary -= 360;
        }
        return primary;
    };

    return {
        primary: primary,
        secondary: inc(),
        tertiary: inc(),
        surface: inc(),
        error: error
    };
}

export function genSchemes(primary: number, size = 16, step = 60): Array<Scheme> {
    const schemes: Array<Scheme> = [];
    for (let i = 0; i < size; i++) {
        schemes.push(genScheme(primary + i * 48, undefined, step));
    }
    return schemes;
}
