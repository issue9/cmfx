// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

const messages = {
    fullscreen: 'full screen',
    settings: 'settings',
    ok: 'OK',
    reset: 'reset',
    error: {
        backHome: 'back home',
        backPrev: 'back prev page',
        pageNotFound: 'page not found',
        forbidden: 'forbidden',
        internalServerError: 'server error',
    },
    login: {
        title: 'login',
        username: 'username',
        password: 'password'
    },
    theme: {
        mode: 'theme mode',
        dark: 'dark',
        light: 'light',
        system: 'system',
        primaryColor: 'primary color'
    },
    contrast: {
        contrast: 'contrast',
        standard: 'standard',
        medium: 'medium',
        high: 'high'
    },
    locale: {
        locale: 'locale',
        uiLanguage: 'ui language',
    }
};

export default messages;

export type Messages = typeof messages;
