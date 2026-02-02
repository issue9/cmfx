// SPDX-FileCopyrightText: 2024-2026 caixw
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
        close: 'Close',
        backtop: 'Back to top',
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
        settings: {
            fontSize: 'Font size',
            fontSizeDesc: 'Customize the font size of the page',
            mode: 'Theme mode',
            modeDesc: 'Customize the theme mode of the page',
            dark: 'Dark',
            light: 'Light',
            system: 'System',
            scheme: 'Theme scheme',
            schemeDesc: 'Customize the theme scheme of the page',
            locale: 'Locale',
            localeDesc: 'Set the ui language of the page',
            displayStyle: 'Display style',
            displayStyleDesc: 'Set the display style of page',
            timezone: 'Timezone',
            timezoneDesc: 'Set the timezone of the page',
            stays: 'Stays duration',
            staysDesc: 'Set the stays duration of the notify',
            long: 'long',
            short: 'short',
            narrow: 'narrow',
            systemNotify: 'System notify',
            systemNotifyDesc: 'Send the notification to the operating system\'s notification center. If this is unavailable, click `{request}` button to manually refresh permissions.',
            enabled: 'Enabled',
            requestNotifyPermission: 'Request notify permission',
            resetOptions: 'Reset options',
            transitionDuration: 'Transition duration',
            transitionDurationDesc: 'Sets the duration of all animation effects. If animations are disabled in the operating system, this setting will not be available.',
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
