// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { default as m } from './en.lang';

const messages: typeof m = {
    _d: {
        stages: {
            codeDemo: '代码演示',

            api: 'API',
            param: '参数',
            type: '类型',
            preset: '默认值',
            reactive: '响应式',
            desc: '描述',
        },
        main: {
            home: '首页',
            docs: '文档',
            components: '组件',
            dark: '深色模式',
            light: '浅色模式',
            system: '跟随系统',
            themeBuilder: '主题编辑器',
        },
        home: {
            desc: '一款基于 {go} 和 {solidjs} 的快速后台管理开发框架',
            start: '开始使用',
        },
        docs: {
            intro: '介绍',
            usage: '使用',
            install: '安装',
            platform: '支持的平台',
            faq: '常见问题',
            advance: '高级',
            theme: '主题',
            locale: '国际化',
            changelog: '变更日志',
        },
        demo: {
            general: '通用',
            layout: '布局',
            navigation: '导航',
            dataInput: '数据输入',
            dataDisplay: '数据展示',
            feedback: '反馈',
            config: '配置',
        },
        theme: {
            builder: '主题编辑器',
            dark: '深色',
            light: '浅色',
            export: '导出配置',
            apply: '应用主题',
            componentsDemo: '组件展示',
            fontSize: '字体大小',
            colors: '颜色',
            radius: '圆角',
            transitionDuration: '动画时长',
            randomContrastLess: '生成低对比度主题',
            randomContrastMore: '生成高对比度主题',
            randomContrastNormal: '生成主题',
            otherParams: '其它参数',
        }
    }
};

export default messages;
