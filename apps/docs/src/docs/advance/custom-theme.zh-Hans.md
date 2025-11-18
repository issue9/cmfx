# 自定义主题

对于自定义主题最简单的方法是直接使用[生成工具](/theme-builder)生成一个主题对象，然后在此基础上作二次修改即可。

主题对象的结构如下：

```ts
export interface Scheme {
    [k: string]: any;

    // 对主题的修改，大部分是对 tailwind 主题的修改，其字段来源于：
    // https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css

    /**
     * 用于指示当前主题颜色的对比度
     */
    contrast: number;

    // NOTE: 主题颜色值是必须要定义的，不能从父元素继承。

    dark: Palettes;
    light: Palettes;

    /**
     * 全局字体的大小
     *
     * @remarks
     * 该值将会修改 html 下的 font-size 属性。默认值为 16px。
     * 当多个主题嵌套设置时，最后调用 changeScheme 的 font-size 会应用到全局。
     */
    fontSize?: string;

    /**
     * 表示 tailwind 中 --radius-* 的数值
     */
    radius?: Radius;

    /**
     * 动画的时长，默认为 300，单位为 ms。
     */
    transitionDuration?: number;
}

/**
 * 圆角参数的设置，单位为 rem。
 */
export interface Radius {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
}

export interface Palettes {
    [key: string]: string;

    'primary-fg': string;
    'primary-fg-low': string;
    'primary-fg-high': string;
    'primary-bg': string;
    'primary-bg-low': string;
    'primary-bg-high': string;

    'secondary-fg': string;
    'secondary-fg-low': string;
    'secondary-fg-high': string;
    'secondary-bg': string;
    'secondary-bg-low': string;
    'secondary-bg-high': string;

    'tertiary-fg': string;
    'tertiary-fg-low': string;
    'tertiary-fg-high': string;
    'tertiary-bg': string;
    'tertiary-bg-low': string;
    'tertiary-bg-high': string;

    'error-fg': string;
    'error-fg-low': string;
    'error-fg-high': string;
    'error-bg': string;
    'error-bg-low': string;
    'error-bg-high': string;

    'surface-fg': string;
    'surface-fg-low': string;
    'surface-fg-high': string;
    'surface-bg': string;
    'surface-bg-low': string;
    'surface-bg-high': string;
}
```
