// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError, notify, useLocale, useOptions } from '@cmfx/components';
import { Return, Token } from '@cmfx/core';
import { createContext, createResource, ParentProps, ResourceReturn, useContext } from 'solid-js';
import { z } from 'zod';

import { sexSchema, stateSchema } from '@/schemas';
import { useOptions as useAdminOptions } from './options';
import { useAPI, useREST } from './rest';

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

const adminContext = createContext<ResourceReturn<Admin | undefined>>();

/**
 * 提供获取管理员信息的环境
 *
 * @remarks
 * 依赖 {@link APIProvider} 和 {@link OptionsProvider} 组件，必须在其之内使用。
 */
export function AdminProvider(props: ParentProps) {
    const l = useLocale();
    const opt = useAdminOptions();
    const api = useAPI();

    const res = createResource(async (): Promise<Admin | undefined> => {
        if (!api.isLogin()) { return; }

        // 依然可能 401，比如由服务器导致的用户退出，api.isLogin 是检测不出来的。

        const r = await api.get<Admin>(opt.api.info);
        if (r.ok) {
            const u = r.body;
            if (u && !u.avatar) { u.avatar = opt.logo; }
            return u;
        }

        const title = r.body ? r.body.title : l.t('_p.app.fetchUserInfoError');
        notify(title, undefined, 'error', l.locale.toString());
    });

    return <adminContext.Provider value={res}>
        {props.children}
    </adminContext.Provider>;
}

/**
 * 返回用于操作当前登录用户的操作接口
 */
export function useAdmin() {
    const admin = useContext(adminContext);
    if (!admin) { throw new ContextNotFoundError('adminContext'); }
    const [info, actions] = admin;

    const opt = useAdminOptions();
    const rest = useREST();
    const [set] = useOptions();

    return {
        /**
         * 是否已经登录
         */
        isLogin() { return !info.loading && info(); },

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
                await actions.refetch();
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
            actions.mutate(); // 此操作不会调用从服务器更新数据
            //setLoginState(false);
            set.switchConfig(opt.configName);
        },

        /**
         * 返回当前登录的用户信息
         */
        info() { return info(); },

        /**
         * 从服务器更新数据
         */
        async refetch() { await actions.refetch(); },
    };
}
