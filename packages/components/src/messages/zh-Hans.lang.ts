// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { default as m } from './en.lang';

const messages: typeof m = {
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

            lastMonth: '上月',
            lastQuarter: '上季度',
            thisQuarter: '本季度',
            nextQuarter: '下季度',
            lastYear: '去年',
            thisYear: '今年',
            nextYear: '明年',
        },
        color: {
            lightness: '亮度(L)',
            chroma: '色度(C)',
            hue: '色相(H)',
            alpha: '透明度(A)',
        },
        pagination: {
            prev: '前一页',
            next: '下一页',
            firstPage: '首页',
            lastPage: '末页',
            items: '{ start }-{ end } / { count }'
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
        theme: {
            mode: '模式',
            dark: '深色',
            light: '浅色',
            nopreference: '正常',
            less: '低',
            more: '高',
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
