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
        augest: 'Aug',
        september: 'Sep',
        october: 'Oct',
        november: 'Nov',
        december: 'Dec',
        today: 'today',
        now: 'now'
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
