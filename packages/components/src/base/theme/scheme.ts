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

/**
 * 根据给定的颜色值生成 Scheme 对象
 *
 * @param primary 主色调的色像值，[0-360] 之间，除去 error 之外的颜色都将根据此值自动生成；
 * @param error 指定 error 色盘的色像值，如果未指定，则采用默认值，不会根据 primary 而变化；
 * @param step 用于计算其它辅助色色像的步长；
 */
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

/**
 * 生成一组主题数据
 *
 * @param primary 第一个主题的主色调；
 * @param size 生成的量；
 * @param step 用于计算每一组主题色的辅助色色像步长；
 */
export function genSchemes(primary: number, size = 16, step = 60): Array<Scheme> {
    const schemes: Array<Scheme> = [];
    for (let i = 0; i < size; i++) {
        schemes.push(genScheme(primary + i * 48, undefined, step));
    }
    return schemes;
}
