# SVG

## 图标

cmfx 默认采用 [unplugin-icons](https://github.com/antfu/unplugin-icons) 管理图标，
可以很方便地使用 <https://icon-sets.iconify.design/> 下的所有图标。

## 插画

[@cmfx/illustrations](https://www.npmjs.com/package/@cmfx/illustrations) 内置了两套插画集，
主要供 [@cmfx/admin](https://www.npmjs.com/package/@cmfx/illustrations) 使用，
在 admin 的配置项中可以指定使用哪个插画集，用户也可以通过 `createGallery` 方法创建自定义插画集。

相对于第三方的插图，该组插图可以正常处理主题相关的属性，根据上下文环境切换对应色彩主题。
