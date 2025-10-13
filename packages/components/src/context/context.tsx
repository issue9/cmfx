// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Config, DisplayStyle, Hotkey, Locale, Problem } from '@cmfx/core';
import {
    createContext, createEffect, createResource, JSX, Match, ParentProps, splitProps, Switch, useContext
} from 'solid-js';
import { createStore } from 'solid-js/store';
import IconProgress from '~icons/material-symbols/progress-activity';

import { Mode, Scheme } from '@/base';
import { registerLocales } from '@/chart/locale';
import { LocaleProvider } from './locale';
import { Options } from './options';
import styles from './style.module.css';
import { applyTheme, ThemeProvider } from './theme';

const localeKey = 'locale';
const displayStyleKey = 'display-style';
const schemeKey = 'scheme';
const modeKey = 'mode';
const tzKey = 'timezone';

/**
 * 提供了对全局配置的更改
 */
export type Actions = ReturnType<typeof buildActions>;

// 添加了部分仅内部可见的属性
type InternalOptions = Options & {
    api?: API;
    config?: Config;
    actions?: Actions;
};

type InternalOptionsContext = ReturnType<typeof createStore<InternalOptions>>;

const internalOptionsContext = createContext<InternalOptionsContext>();

function useInternalOptions(): InternalOptionsContext {
    const ctx = useContext(internalOptionsContext);
    if (!ctx) {
        throw '未找到正确的 optionsContext';
    }
    return ctx;
}

/**
 * 初始化当前组件的环境
 *
 * NOTE: 这是用于初始化项目的最外层组件，不保证任何属性是否有响应状态。
 */
export function OptionsProvider(props: ParentProps<Options>): JSX.Element {
    Hotkey.init(); // 初始化快捷键。
    Locale.init(props.locale);

    const [_, opt] = splitProps(props, ['children']);
    const obj = createStore<InternalOptions>(opt);
    obj[1]({
        config: new Config(props.id, props.configName, props.storage),
        actions: buildActions(obj),
    });

    // 仅调用一次，所有异步操作均由此方法完成。
    const [data] = createResource(true, async () => {
        for (const [key, loaders] of Object.entries(props.messages)) {
            await Locale.addDict(key, ...loaders);
            await registerLocales(key); // 加载图表组件的本地化语言
        }

        const api = await API.build(props.id+'-token', props.storage, props.apiBase,
            props.apiToken, props.apiContentType, props.apiAcceptType, props.locale);
        await api.clearCache(); // 刷新或是重新打开之后，清除之前的缓存。
        obj[1]({ api: api });

        return obj[0];
    }, {initialValue: opt});

    createEffect(() => {
        const d = data();
        if (d && d.schemes && d.scheme) { // 如果没有这两个值，说明不需要主题。
            applyTheme(document.documentElement, {
                scheme: (typeof d.scheme === 'string') ? d.schemes.get(d.scheme) : d.scheme,
                mode: d.mode,
            });
        }
    });

    // NOTE: 需要通过 data.loading 等待 createResource 完成，才能真正加载组件。

    return <internalOptionsContext.Provider value={obj}>
        <Switch fallback={<div class={styles.loading}><IconProgress /></div>}>
            <Match when={!data.loading ? data() : undefined}>
                {d =>
                    <ThemeProvider mode={d().mode} styleElement={document.documentElement}
                        scheme={
                            typeof d().scheme === 'string'
                                ? d().schemes?.get(d().scheme as string)
                                : d().scheme as Scheme
                        }
                    >
                        <LocaleProvider id={d().locale} displayStyle={d().displayStyle} timezone={d().timezone}>
                            {props.children}
                        </LocaleProvider>
                    </ThemeProvider>
                }
            </Match>
        </Switch>
    </internalOptionsContext.Provider>;
}

/**
 * 获取组件库的顶层配置项及期衍生出来的一些操作方法
 *
 * @returns 返回一个元组，包含以下属性：
 * - 0: API 对象，这是一个全局对象，需要注意一些属性的修改，比如本地化信息；
 * - 1: 组件库提供的其它方法；
 * - 2: 组件库初始化时的选项；
 */
export function useComponents() {
    const options = useInternalOptions()[0];
    return [options.api, options.actions, options] as [api: API, actions: Actions, options: Options];
}

export function buildActions(ctx: InternalOptionsContext) {
    const options = ctx[0];
    const setOptions = ctx[1];

    return {
        /**
         * 设置 HTML 文档的标题
         */
        setTitle(v: string) {
            if (options.title) { v = v + options.titleSeparator + options.title; }
            document.title = v;
        },

        /**
         * 切换配置
         *
         * @param id - 新配置的 ID；
         */
        switchConfig(id: string | number) {
            options.config!.switch(id);

            setOptions({ // 读取新配置
                scheme: options.config!.get(schemeKey) ?? options.scheme,
                mode: options.config!.get(modeKey) ?? options.mode,
                locale: options.config!.get(localeKey) ?? options.locale,
                displayStyle: options.config!.get(displayStyleKey) ?? options.displayStyle,
                timezone: options.config!.get(tzKey) ?? options.timezone,
            });
        },

        /**
         * 切换语言
         *
         * @param id - 新语言的 ID
         */
        switchLocale(id: string): void {
            setOptions({ locale: id });
            options.config!.set(localeKey, id);
            document.documentElement.lang = id;
        },

        /**
         * 切换单位样式
         */
        switchDisplayStyle(style: DisplayStyle) {
            setOptions({ displayStyle: style });
            options.config!.set(displayStyleKey, style);
        },

        /**
         * 切换时区
         */
        switchTimezone(tz: string) {
            setOptions({ timezone: tz });
            options.config!.set(tzKey, tz);
        },

        /**
         * 切换主题色
         *
         * @param scheme - 新主题色的 ID 或 {@link Scheme} 对象，
         * 如果是对象类型，需要注意该值必须是能被 {@link structuredClone} 复制的，防止外部修改时，引起主题变化。
         */
        switchScheme(scheme: string | Scheme) {
            const s = structuredClone((typeof scheme === 'string') ? options.schemes!.get(scheme) : scheme);
            setOptions({ scheme: s });
            options.config!.set(schemeKey, s);
        },

        /**
         * 切换主题模式
         */
        switchMode(mode: Mode) {
            setOptions({ mode: mode });
            options.config!.set(modeKey, mode);
        },

        /**
         * 对默认的 {@link Problem} 数据处理
         */
        async outputProblem<T = never>(problem?: Problem<T>): Promise<void> {
            await options.outputProblem(problem);
        }
    };
}
