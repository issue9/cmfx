# dev

## 前端

### 色彩管理

前端采用了 tailwindcss 作为样式管理，也提供其默认提供的颜色值。但是不推荐直接使用，提供了以下几种类型的色彩：

- primary
- secondary
- tertiary
- error
- surface

每种颜色又分为以下几种：
 - text 文本色
 - bg 除去文本之外，其它作为‘背景’存在的颜色，比如背景色，边框色等。

同时提供了 palette--primary 等几种 CSS 类，用于指定 --bg 等颜色值，便不会直接指定 background-color

大部分组件也提供了相应在的颜色类型，比如 text-field--primary,button--filled-primary 等。

### 字体

字体采用 https://fonts.google.com/icons 相关定义可参考 style.css
