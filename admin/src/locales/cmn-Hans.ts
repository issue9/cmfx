// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Messages } from './en';

const messages: Messages = {
    fullscreen: '全屏',
    settings: '设置',
    ok: '确定',
    reset: '重置',
    error: {
        backHome: '返回首页',
        backPrev: '返回上一页',
        pageNotFound: '页面不存在',
        forbidden: '无权访问当前页面',
        internalServerError: '服务端错误',
    },
    login: {
        title: '登录',
        username: '账号',
        password: '密码'
    },
    theme: {
        mode: '主题模式',
        dark: '深色主题',
        light: '浅色主题',
        system: '跟随系统',
        primaryColor: '主色调'
    },
    contrast: {
        contrast: '对比度',
        standard: '正常对比度',
        medium: '中等对比度',
        high: '更高的对比度'
    },
    locale: {
        locale: '本地化',
        uiLanguage: '界面语言',
    }
};

export default messages;
