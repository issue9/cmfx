// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { create, Options } from '@/index';

// Vuetify
import { VuetifyOptions } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

const vo: VuetifyOptions = {
    components,
    directives,
};

const o: Options = {
    baseURL: 'http://localhost',
    apis: {
        login: '/login',
        settings: '/settings',
        info: '/info',
    },
    title: 'title',
    logo: 'http://localhost/favicon.ico',
    menus: []
};
const app = await create(o, vo);
app.mount('#app');

