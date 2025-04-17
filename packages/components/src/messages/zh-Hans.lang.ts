// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { default as m } from './en.lang';

const messages: typeof m = {
    _i: {
        fullscreen: '全屏',
        successful: '成功',
        ok: '确定',
        os: '操作系统',
        cpu: 'CPU',
        process: '进程',
        memory: '内存',
        database: '数据库',
        search: '搜索',
        cancel: '取消',
        reset: '重置',
        refresh: '刷新',
        print: '打印',
        areYouSure: '你确定要这么做吗？',
        app: {
            keyDesc: '\'<kbd>\'&#8593;\'</kbd>\' \'<kbd>\'&#8595;\'</kbd>\' 选择项；\'<kbd>\'Enter\'</kbd>\' 确定选择；\'<kbd>\'ESC\'</kbd>\' 关闭。',
            searchAtSidebar: '搜索侧边栏菜单',
        },
        timer: {
            seconds: '秒',
            minutes: '分',
            hours: '小时',
            days: '天'
        },
        table: {
            nodata: '没有数据',
            exportTo: '导出为 {type}',
            hoverable: '悬停效果',
            striped: '条纹间隔 {num}',
            noStriped: '无',
            stickyHeader: '固定表格头',
            fitScreen: '扩展至整个屏幕大小',
            downloadFilename: '下载的文件名',
        },
        pagination: {
            prev: '前一页',
            next: '下一页',
            firstPage: '首页',
            lastPage: '末页',
            items: '{ start }-{ end } / { count }'
        },
        date: {
            clear: '清除',
            today: '今日',
            now: '现在',
            prevMonth: '上个月',
            prevYear: '上一年',
            nextMonth: '下个月',
            nextYear: '下一年',
        },
        error: {
            backHome: '返回首页',
            backPrev: '返回上一页',
            unknownError: '未知错误',
            pageNotFound: '页面不存在',
            forbidden: '无权访问当前页面',
            internalServerError: '服务端错误',

            // 以下为一些内置的错误提示信息
            canNotBeEmpty: '不能为空',
            oldNewPasswordCanNotBeEqual: '新密码不能与旧密码相同',
            newConfirmPasswordMustBeEqual: '确认密码与新密码并不相同',
        },
        theme: {
            mode: '主题模式',
            modeDesc: '自定义页面的主题模式',
            dark: '深色主题',
            light: '浅色主题',
            system: '跟随系统',
            color: '主色调',
            colorDesc: '自定义页面的主色调',
            contrast: '对比度',
            contrastDesc: '调整页面的对比度',
            nopreference: '正常',
            less: '减少对比度',
            more: '加大对比度'
        },
        contrast: {
            contrast: '对比度',
            standard: '正常对比度',
            medium: '中等对比度',
            high: '更高的对比度'
        },
        locale: {
            locale: '本地化',
            localeDesc: '设置页面的界面语言',
            uiLanguage: '界面语言',
            unitStyle: '显示形式',
            unitStyleDesc: '设置各类数据的显示形式',
            long: '完整格式',
            short: '短格式',
            narrow: '精简格式'
        }
    }
};

export default messages;
