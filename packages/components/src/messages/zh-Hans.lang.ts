// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import type { Messages } from './en.lang';

const messages: Messages = {
    _c: {
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
        copied: '已复制',
        copy: '复制',
        date: {
            clear: '清除',
            today: '今日',
            now: '现在',
            prevMonth: '上个月',
            prevYear: '上一年',
            followingMonth: '下个月',
            followingYear: '下一年',
            thisMonth: '当前月份',

            lastMonth: '上月',
            lastQuarter: '上季度',
            thisQuarter: '本季度',
            nextQuarter: '下季度',
            lastYear: '去年',
            thisYear: '今年',
            nextYear: '明年',

            week: '周',
        },
        color: {
            vars: 'Tailwind 变量',
            oklch: 'OKLCH',
            hsl: 'HSL',
            rgb: 'RGB',
            lightness: '亮度(L)',
            chroma: '色度(C)',
            hue: '色相(H)',
            saturation: '饱和度(S)',
            alpha: '透明度(A)',
            red: '红(R)',
            green: '绿(G)',
            blue: '蓝(B)',
            preset: '预设值',
            websafe: 'Web 安全色',
        },
        pagination: {
            prev: '前一页',
            next: '下一页',
            firstPage: '首页',
            lastPage: '末页',
            items: '{ start }-{ end } / { count }'
        },
        settings: {
            mode: '主题模式',
            modeDesc: '自定义页面的主题模式',
            dark: '深色主题',
            light: '浅色主题',
            system: '跟随系统',
            color: '主色调',
            colorDesc: '自定义页面的主色调',
            locale: '本地化',
            localeDesc: '页面使用的语言',
            displayStyle: '显示形式',
            displayStyleDesc: '各类与本地化相关数据的显示形式',
            timezone: '时区',
            timezoneDesc: '当前浏览器显示的时区，仅限当前浏览器有效果。',
            stays: '停留时间',
            staysDesc: '通知类弹出框的默认停留时间，单位为毫秒。',
            long: '完整格式',
            short: '短格式',
            narrow: '精简格式',
            systemNotify: '系统通知',
            systemNotifyDesc: '将通知发送到操作系统的通知中心。若不可用，可点击`{request}`按钮手动刷新权限。',
            enabled: '启用',
            requestNotifyPermission: '请求权限',
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
            deleteRow: '删除',
        },
        timer: {
            seconds: '秒',
            minutes: '分',
            hours: '小时',
            days: '天'
        },
        tour: {
            prev: '前一项',
            next: '下一项',
            start: '开始',
            complete: '完成'
        }
    }
};

export default messages;
