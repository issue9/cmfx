# components

框架内部使用的组件库

组件如果需要引用 useApp，应该从 @/app/context 导入，而不是从 @/app 导入，
因为 @/app 也引用了当前上当下的组件，直接从 @/app 引用可能造成循环引用。
