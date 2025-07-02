// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Mode, Notify, Options, OptionsProvider, SystemDialog, notify, use as useComponents } from '@cmfx/components';
import { API, Problem, Return, Token, UnitStyle } from '@cmfx/core';
import { useLocation, useNavigate } from '@solidjs/router';
import { JSX, ParentProps, createContext, createResource, mergeProps, useContext } from 'solid-js';

import { HTTPError } from '@/app/errors';
import { build as buildOptions } from '@/options/options';
import { User } from './user';

type OptContext = ReturnType<typeof buildOptions>;

type InternalOptions = OptContext & {
    coreAPI: API;
    actions: ReturnType<typeof buildActions>;
};

const internalOptContext = createContext<InternalOptions>();

// 保存于 sessionStorage 中的表示当前登录用户的 id
const currentKey = '-uid';

/**
 * @returns 返回一个元组，包含以下属性：
 * - 0: API 对象，这是一个全局对象，需要注意一些属性的修改，比如本地化信息；
 * - 1: 组件库提供的其它方法；
 * - 2: 组件库初始化时的选项；
 */
export function use() {
    const ctx = useContext(internalOptContext);
    if (!ctx) {
        throw '未找到正确的 optContext';
    }
    return [ctx.coreAPI, ctx.actions, ctx] as [api: API, actions: ReturnType<typeof buildActions>, options: OptContext];
}

// NOTE: 需要保证在 Router 组件之内
export function Provider(props: ParentProps<OptContext>): JSX.Element {
    const loc = useLocation();
    const nav = useNavigate();

    const o: Options = {
        id: props.id,
        storage: props.storage,
        configName: props.configName,

        scheme: props.theme.scheme,
        schemes: props.theme.schemes,
        mode: props.theme.mode,

        locale: props.locales.fallback,
        unitStyle: props.locales.unitStyle!,
        messages: props.locales.messages,

        apiBase: props.api.base,
        apiToken: props.api.token,
        apiAcceptType: props.api.acceptType,
        apiContentType: props.api.contentType,

        title: props.title,
        titleSeparator: props.titleSeparator,
        pageSizes: props.api.pageSizes,
        pageSize: props.api.presetSize,
        outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
            if (!p) {
                throw '发生了一个未知的错误，请联系管理员！';
            }

            if ((p.status === 401) && (props.routes.public.home !== loc.pathname)) {
                nav(props.routes.public.home);
            } else if (p.status >= 500) {
                throw new HTTPError(p.status, p.title);
            } else {
                await notify(p.title, p.detail, 'error');
            }
        }
    };

    const child = () => {
        const [api, act] = useComponents();
        const p = mergeProps(props, {
            coreAPI: api,
            actions: buildActions(api, act, props, nav),
        });

        const uid = parseInt(sessionStorage.getItem(o.id + currentKey) ?? '0');
        p.actions.switchConfig(uid);

        return <internalOptContext.Provider value={p}>
            {props.children}
        </internalOptContext.Provider>;
    };

    return <OptionsProvider {...o}>
        <SystemDialog system={props.system.dialog} header={props.title}>
            <Notify system={props.system.notification} lang={props.locales.fallback} icon={props.logo} timeout={props.notifyTimeout}>
                {child()}
            </Notify>
        </SystemDialog>
    </OptionsProvider>;
}

function buildActions(api: API, act: ReturnType<typeof useComponents>[1], opt: OptContext,nav: ReturnType<typeof useNavigate>) {
    const [user, userData] = createResource(async (): Promise<User | undefined> => {
        if (!api.isLogin()) {
            return {} as User; // 虽然返回的值没有用，但不能是 undefined，否则会出错。
        }

        // 依然可能 401，比如由服务器导致的用户退出，f.isLogin 是检测不出来的。

        const r = await api.get<User>(opt.api.info);
        if (r.ok) {
            const u = r.body;
            if (u && !u.avatar) {
                u.avatar = opt.logo;
            }
            return u;
        }

        // 此时 notify 还未初始化
        console.error(r.body?.title);
    });

    return {
        /**
         * 是否已经登录
         */
        isLogin() { return api.isLogin(); },

        /**
         * 清除浏览器的所有缓存
         */
        async clearCache(): Promise<void> {
            await api.clearCache();

            // localStorage
            localStorage.clear();
            sessionStorage.clear();

            // IndexedDB
            const dbs = await indexedDB.databases();
            for (const db of dbs) {
                if (db.name) {
                    indexedDB.deleteDatabase(db.name);
                }
            }

            await api.logout();

            nav(opt.routes.public.home);
        },

        /**
         * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
         *
         * @param p 如果该值空，则会抛出异常；
         */
        async outputProblem<P>(p?: Problem<P>): Promise<void> { await act.outputProblem(p); },

        /**
         * 设置登录状态并刷新 user
         *
         * 相较于 {@link API#login} 此方法除了登录，还执行一些额外的操作。
         *
         * @param r 登录接口返回的数据
         * @returns true 表示登录成功，其它情况表示错误信息
         */
        async login(r: Return<Token, never>) {
            const ret = await api.login(r);
            if (ret === true) {
                await userData.refetch();
                const uid = this.user()!.id!.toString();
                sessionStorage.setItem(opt.id + currentKey, uid);
                act.switchConfig(uid);
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
            await api.logout();
            sessionStorage.removeItem(opt.id + currentKey);
            await userData.refetch();
            act.switchConfig(opt.configName);
        },

        /**
         * 返回当前登录的用户信息
         */
        user() { return user(); },

        /**
         * 从服务器更新数据
         */
        async refetchUser() { await userData.refetch(); },

        setTitle(v: string) { act.setTitle(v); },

        switchConfig(id: string | number): void { act.switchConfig(id); },

        /**
         * 切换主题色
         */
        switchScheme(scheme: string) { act.switchScheme(scheme); },

        /**
         * 切换主题模式
         */
        switchMode(mode: Mode) { act.switchMode(mode); },

        /**
         * 切换本地化对象
         *
         * @param id 本地化 ID
         */
        switchLocale(id: string) { act.switchLocale(id); },

        switchUnitStyle(style: UnitStyle) { act.switchUnitStyle(style); },
    };
}
