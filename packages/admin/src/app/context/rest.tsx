// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/components';
import { API, REST } from '@cmfx/core';

import { useOptions } from './options';

/**
 * 返回 {@link API} 对象
 */
export function useAPI(): API {
    const ctx = useOptions();
    return ctx.coreAPI;
}

/**
 * 返回与后端通讯的基本接口集合
 *
 * @remarks
 * 与 {@link useAPI} 的不同点在于只提供了基本的功能，但是会添加一个基于当前环境的 Accept-Language 报头信息。
 */
export function useREST(): REST {
    const api = useAPI();
    const l = useLocale();
    return api.rest(new Headers({ 'Accept-Language': l.locale.toString() }));
}
