/* eslint-disable semi */
// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { App, InjectionKey, Plugin } from 'vue';
import { Options, buildOptions } from './options';

export const optionsKey = Symbol() as InjectionKey<Required<Options>>;

/**
 * 将整个项目的设置项作为插件添加到 vue
 */
export function createOptions(o: Options): Plugin<Options> {
    return {
        install(app: App) {
            app.provide(optionsKey, buildOptions(o));
        }
    };
}
