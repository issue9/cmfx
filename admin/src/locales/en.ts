// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

const messages = {
    fullscreen: 'full screen',
    settings: 'settings',
    ok: 'OK',
    search: 'search',
    cancel: 'cancel',
    reset: 'reset',
    refresh: 'refresh',
    areYouSure: 'are you sure?',
    page: { // 页面的翻译内容
        newItem: 'new item',
        created: 'create time',
        id: 'ID',
        no: 'NO',
        state: 'state',
        states: {
            normal: 'normal',
            locked: 'locked',
            deleted: 'deleted'
        },
        actions: 'actions',
        edit: 'edit',
        sex: 'sex',
        sexes: {
            male: 'male',
            female: 'female',
            unknown: 'unknown'
        },
        admin: {
            name: 'name',
            nickname: 'nick name'
        },
        securitylog: {
            content: 'content',
            ip: 'IP',
            ua: 'user agent',
        },
        roles: {
            name: 'name',
            description: 'description'
        }
    },
    table: {
        nodata: 'no data',
        exportTo: 'export to {{type}}'
    },
    pagination: {
        prev: 'prev',
        next: 'next',
        firstPage: 'first page',
        lastPage: 'last page',
        items: '{{ start }}-{{ end }} of {{ count }}'
    },
    date: {
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
        january: 'Jan',
        february: 'Feb',
        march: 'Mar',
        april: 'Apr',
        may: 'May',
        june: 'Jun',
        july: 'Jul',
        august: 'Aug',
        september: 'Sep',
        october: 'Oct',
        november: 'Nov',
        december: 'Dec',
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
    },
    login: {
        title: 'login',
        logout: 'logout',
        username: 'username',
        password: 'password'
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
    }
};

export default messages;

export type Messages = typeof messages;
