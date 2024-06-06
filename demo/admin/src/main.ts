// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { create, Options } from 'admin';

// Vuetify
import { VuetifyOptions } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

const vo: VuetifyOptions = {
    components,
    directives,
};

const o: Options = {}

create(o, vo).mount('#app');
