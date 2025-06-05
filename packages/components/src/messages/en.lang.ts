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
        date: {
            clear: 'Clear',
            today: 'Today',
            now: 'Now',
            prevMonth: 'Prev month',
            prevYear: 'Prev year',
            nextMonth: 'Next month',
            nextYear: 'Next year',
        },
        error: {
            backHome: 'Back home',
            backPrev: 'Back prev page',
            unknownError: 'Unknown error',
            pageNotFound: 'Page not found',
            forbidden: 'Forbidden',
            internalServerError: 'Server error',

            // 以下为一些内置的错误提示信息
            canNotBeEmpty: 'Can not be empty',
            oldNewPasswordCanNotBeEqual: 'The old password and new password can not be equal',
            newConfirmPasswordMustBeEqual: 'The new password and confirm password must be equal',
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
        theme: {
            mode: 'Theme mode',
            dark: 'Dark',
            light: 'Light',
            contrast: 'Contrast',
            nopreference: 'No preference',
            less: 'Less',
            more: 'More',
            export: 'Export',
            apply: 'Apply',
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
