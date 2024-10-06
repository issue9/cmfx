// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Messages } from './en';

const messages: Messages = {
    _i: {
        fullscreen: '全屏',
        ok: '确定',
        os: '操作系统',
        database: '数据库',
        search: '搜索',
        cancel: '取消',
        reset: '重置',
        refresh: '刷新',
        areYouSure: '你确定要这么做吗？',
        page: { // 页面的翻译内容
            editItem: '编辑',
            deleteItem: '删除',
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
            sex: '性别',
            sexes: {
                male: '男',
                female: '女',
                unknown: '未知'
            },
            current: { // 登录框
                title: '登录',
                username: '账号',
                password: '密码',
                home: '首页',
                logout: '退出',
                settings: '设置',
                securitylog: '安全日志',
                content: '内容',
                ip: 'IP',
                ua: 'UA',
                uaInfo: '浏览器: {browser}({browserVersion}) 系统: {os}({osVersion}) 内核: {kernal}({kernalVersion})',
            },
            system: {
                apis: 'API',
                apiViewer: 'API',
                router: '路由',
                method: '请求方法',
                pattern: '路径',
                count: '访问次数',
                last: '最后访问时间',
                userErrors: '出错次数(5xx)',
                serverErrors: '出错次数(4xx)',
                max: '最长耗时',
                min: '最短耗时',
                spend: '平均耗时',

                services: '服务',
                jobs: '计划任务',
                serviceViewer: '服务',
                serviceState: '状态',
                serviceStates: {
                    running: '运行',
                    stopped: '停止',
                    failed: '出错'
                },
                title: '名称',
                error: '错误内容',
                next: '下次执行时间',
                prev: '上次执行时间',

                info: '信息',
                states: '状态',
                system: '系统',
                backupDB: '备份数据库',
                backupDBHelp: '此操作为手动执行一次备份操作。计划任务还会按照 {cron} 执行备份操作。',
                clearCache: '清除缓存',
                clearCacheHelp: '清除浏览器的所有缓存，这将导致当前用户退出以及相关的用户设置。',
                name: '名称',
                arch: '架构',
                cpus: '核心数量',
                go: 'Go',
                uptime: '上线时间',
                platform: '平台',
                family: '系列',
                version: '版本',
                connections: '连接数',
                unlimited: '未限制',
                connectionsHelp: '允许最大的连接数: {maxOpenConnections}\n当前打开的连接数: {openConnections}\n使用中的连接: {inUse}\n空闲的连接: {idle}',
                waitCount: '待连接的数量',
                waitDuration: '待连接的时间',
            },
            admin: {
                admin: '管理员',
                adminsManager: '管理员',
                name: '姓名',
                nickname: '昵称'
            },
            roles: {
                roles: '角色',
                rolesManager: '角色管理',
                permission: '权限管理',
                name: '名称',
                editPermission: '权限',
                description: '描述'
            }
        },
        table: {
            nodata: '没有数据',
            exportTo: '导出为 {type}'
        },
        pagination: {
            prev: '前一页',
            next: '下一页',
            firstPage: '首页',
            lastPage: '末页',
            items: '{ start }-{ end } / { count }'
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
