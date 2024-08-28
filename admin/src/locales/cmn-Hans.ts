// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Messages } from './en';

const messages: Messages = {
    _i: {
        fullscreen: '全屏',
        settings: '设置',
        ok: '确定',
        search: '搜索',
        cancel: '取消',
        reset: '重置',
        refresh: '刷新',
        areYouSure: '你确定要这么做吗？',
        page: { // 页面的翻译内容
            newItem: '新建',
            created: '添加时间',
            id: 'ID',
            no: 'NO',
            state: '状态',
            states: {
                normal: '正常',
                locked: '锁定',
                deleted: '删除'
            },
            actions: '操作',
            edit: '编辑',
            sex: '性别',
            sexes: {
                male: '男',
                female: '女',
                unknown: '未知'
            },
            admin: {
                name: '姓名',
                nickname: '昵称'
            },
            securitylog: {
                content: '内容',
                ip: 'IP',
                ua: 'UA',
            },
            roles: {
                name: '名称',
                description: '描述'
            }
        },
        table: {
            nodata: '没有数据',
            exportTo: '导出为 {{type}}'
        },
        pagination: {
            prev: '前一页',
            next: '下一页',
            firstPage: '首页',
            lastPage: '末页',
            items: '{{ start }}-{{ end }} / {{ count }}'
        },
        date: {
            monday: '一',
            tuesday: '二',
            wednesday: '三',
            thursday: '四',
            friday: '五',
            saturday: '六',
            sunday: '日',
            january: '一月',
            february: '二月',
            march: '三月',
            april: '四月',
            may: '五月',
            june: '六月',
            july: '七月',
            august: '八月',
            september: '九月',
            october: '十月',
            november: '十一月',
            december: '十二月',
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
        },
        login: {
            title: '登录',
            logout: '退出',
            username: '账号',
            password: '密码'
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
        }
    }
};

export default messages;
