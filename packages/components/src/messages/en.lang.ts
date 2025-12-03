// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

const messages = {
    _c: {
        fullscreen: 'Full screen',
        successful: 'Successful',
        ok: 'OK',
        os: 'OS',
        cpu: 'CPU',
        process: 'Process',
        memory: 'Memory',
        database: 'Database',
        search: 'Search',
        cancel: 'Cancel',
        reset: 'Reset',
        refresh: 'Refresh',
        print: 'Print',
        areYouSure: 'Are you sure?',
        copied: 'Copied',
        copy: 'Copy',
        date: {
            clear: 'Clear',
            today: 'Today',
            now: 'Now',
            prevMonth: 'The previous month',
            prevYear: 'The previous year',
            followingMonth: 'The following month',
            followingYear: 'The following year',
            thisMonth: 'This month',

            lastMonth: 'Last month',
            lastQuarter: 'Last quarter',
            thisQuarter: 'This quarter',
            nextQuarter: 'Next quarter',
            lastYear: 'Last year',
            thisYear: 'This year',
            nextYear: 'Next year',

            week: 'Week',
        },
        color: {
            vars: 'Tailwind variables',
            oklch: 'OKLCH',
            hsl: 'HSL',
            rgb: 'RGB',
            lightness: 'Lightness',
            chroma: 'Chroma',
            hue: 'Hue',
            saturation: 'Saturation',
            alpha: 'Alpha',
            red: 'Red',
            green: 'Green',
            blue: 'Blue',
            preset: 'Preset',
            websafe: 'Web safe',
        },
        pagination: {
            prev: 'Prev',
            next: 'Next',
            firstPage: 'First page',
            lastPage: 'Last page',
            items: '{ start }-{ end } of { count }'
        },
        table: {
            nodata: 'No data',
            exportTo: 'Export to {type}',
            hoverable: 'Hoverable',
            striped: 'Striped {num}',
            noStriped: 'No striped',
            stickyHeader: 'Sticky header',
            fitScreen: 'Fit screen',
            downloadFilename: 'The filename of download',
            deleteRow: 'Delete row',
        },
        timer: {
            seconds: 'Seconds',
            minutes: 'Minutes',
            hours: 'Hours',
            days: 'Days'
        },
        tour: {
            prev: 'Prev',
            next: 'Next',
            start: 'Start',
            complete: 'Complete'
        }
    }
};

export default messages;

/**
 * 框架内部的翻译对象
 */
export type Messages = typeof messages;
