# 自定义主题

对于自定义主题最简单的方法是直接使用[生成工具](/theme-builder)生成一个主题对象，然后在此基础上作二次修改即可。

主题对象的结构如下：

```ts
/**
 * 定义主题相关的各类变量
 */
export type Scheme = {
    primary: string;
    secondary: string;
    tertiary: string;
    error: string;
    surface: string;

    // NOTE: 主题颜色值是必须要定义的，不能从父元素继承。

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
};

/**
 * 圆角参数的设置
 *
 * @remarks
 * 单位为 rem。属性名表示的是组件的大小。
 */
export type Radius = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
};
```
