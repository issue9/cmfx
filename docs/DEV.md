# dev

## 前端

### 主题

前端采用了 tailwindcss 作为样式管理，也提供其默认提供的颜色值。
可以使用 bg-palette 调用当前组件的背景色，或是 text-primary 等方式调用指定色盘作为文字的颜色。
或是采用 --primary-fg 等 CSS 变量直接赋值。

### 字体

字体采用 <https://fonts.google.com/icons> 相关定义可参考 style.css

### 组件

组件和页面的 CSS 文件，类型名必须以 c-- 或是 p-- 开头，防止不小心类名之间相互覆盖。
