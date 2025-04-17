// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

const messages = {
    _i: {
        fullscreen: 'full screen',
        successful: 'successful',
        ok: 'OK',
        os: 'OS',
        cpu: 'CPU',
        process: 'Process',
        memory: 'memory',
        database: 'database',
        search: 'search',
        cancel: 'cancel',
        reset: 'reset',
        refresh: 'refresh',
        print: 'print',
        areYouSure: 'are you sure?',
        app: {
            keyDesc: '\'<kbd>\'&#8593;\'</kbd>\' \'<kbd>\'&#8595;\'</kbd>\' select item; \'<kbd>\'enter\'</kbd>\' confirm; \'<kbd>\'ESC\'</kbd>\' cancel.',
            searchAtSidebar: 'search at sidebar',
        },
        timer: {
            seconds: 'seconds',
            minutes: 'minutes',
            hours: 'hours',
            days: 'days'
        },
        table: {
            nodata: 'no data',
            exportTo: 'export to {type}',
            hoverable: 'hoverable',
            striped: 'striped {num}',
            noStriped: 'no striped',
            stickyHeader: 'sticky header',
            fitScreen: 'fit screen',
            downloadFilename: 'the filename of download',
        },
        pagination: {
            prev: 'prev',
            next: 'next',
            firstPage: 'first page',
            lastPage: 'last page',
            items: '{ start }-{ end } of { count }'
        },
        date: {
            clear: 'clear',
            today: 'today',
            now: 'now',
            prevMonth: 'prev month',
            prevYear: 'prev year',
            nextMonth: 'next month',
            nextYear: 'next year',
        },
        error: {
            backHome: 'back home',
            backPrev: 'back prev page',
            unknownError: 'unknown error',
            pageNotFound: 'page not found',
            forbidden: 'forbidden',
            internalServerError: 'server error',

            // 以下为一些内置的错误提示信息
            canNotBeEmpty: 'can not be empty',
            oldNewPasswordCanNotBeEqual: 'The old passowrd and new password can not be equal',
            newConfirmPasswordMustBeEqual: 'The new passowrd and confirm password must be equal',

        },
        theme: {
            mode: 'theme mode',
            modeDesc: 'customize the theme mode of the page',
            dark: 'dark',
            light: 'light',
            system: 'system',
            color: 'primary color',
            colorDesc: 'customize the theme primary color of the page',
            contrast: 'contrast',
            contrastDesc: 'customize the theme contrast of the page',
            nopreference: 'no preference',
            less: 'less',
            more: 'more'
        },
        contrast: {
            contrast: 'contrast',
            standard: 'standard',
            medium: 'medium',
            high: 'high'
        },
        locale: {
            locale: 'locale',
            localeDesc: 'set the ui language of the page',
            uiLanguage: 'ui language',
            unitStyle: 'unit display',
            unitStyleDesc: 'set the unit display style of page',
            long: 'long',
            short: 'short',
            narrow: 'narrow'
        }
    }
};

export default messages;
