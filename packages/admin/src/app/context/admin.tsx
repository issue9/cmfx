// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { notify, useLocale, useOptions } from '@cmfx/components';
import { Return, Token } from '@cmfx/core';
import { createResource } from 'solid-js';
import { z } from 'zod';

import { sexSchema, stateSchema } from '@/schemas';
import { useOptions as useAdminOptions } from './options';
import { useREST } from './rest';

export const passportSchema = z.object({
    id: z.string(),
    identity: z.string().min(2).max(32),
});

export const adminSchema = z.object({
    id: z.number().min(1).optional(),
    sex: sexSchema,
    state: stateSchema,
    name: z.string().min(2).max(32),
    nickname: z.string().min(2).max(32),
    avatar: z.string().optional(),
    roles: z.array(z.string()).optional(),
    passports: z.array(passportSchema).optional(),
});

/**
 * 用户的基本信息
 */
export type Admin = z.infer<typeof adminSchema>;

/**
 * 返回用于操作当前登录用户的操作接口
 */
export function useAdmin() {
    const opt = useAdminOptions();
    const l = useLocale();
    const rest = useREST();
    const [set] = useOptions();

    const [info, data] = createResource(async (): Promise<Admin | undefined> => {
        // 虽然返回的值没有用，但不能是 undefined，否则会出错。
        if (!rest.api().isLogin()) { return; }

        // 依然可能 401，比如由服务器导致的用户退出，api.isLogin 是检测不出来的。

        const r = await rest.api().get<Admin>(opt.api.info);
        if (r.ok) {
            const u = r.body;
            if (u && !u.avatar) { u.avatar = opt.logo; }
            return u;
        }

        const title = r.body ? r.body.title : l.t('_p.app.fetchUserInfoError');
        notify(title, undefined, 'error', l.locale.toString());
    });

    return {
        /**
         * 是否已经登录
         */
        isLogin(): boolean {
            // NOTE: API.isLogin 不是响应式的，所以改为 user。
            return !info.loading && !!info();
        },

        /**
         * 设置登录状态并刷新 user
         *
         * 相较于 {@link API#login} 此方法除了登录，还执行一些额外的操作。
         *
         * @param r - 登录接口返回的数据
         * @returns true 表示登录成功，其它情况表示错误信息
         */
        async login(r: Return<Token, never>) {
            const ret = await rest.api().login(r);
            if (ret === true) {
                await data.refetch();
                const uid = this.info()!.id!.toString();
                set.switchConfig(uid);
            }
            return ret;
        },

        /**
         * 退出登录并刷新 user
         *
         * 相较于 {@link API#logout} 此方法除了登录，还执行一些额外的操作。
         *
         */
        async logout() {
            await rest.api().logout();
            data.mutate();
            set.switchConfig(opt.configName!);
        },

        /**
         * 返回当前登录的用户信息
         */
        info() { return info(); },

        /**
         * 从服务器更新数据
         */
        async refetch() { await data.refetch(); },
    };
}
