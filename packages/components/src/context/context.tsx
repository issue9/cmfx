// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { DisplayStyle, Hotkey, I18n } from '@cmfx/core';
import {
    createContext, createResource, JSX, Match, mergeProps, ParentProps, splitProps, Switch, useContext
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { Mode, Scheme } from '@/base';
import { IconCmfxBrandAnimate } from '@/icon';
import { LocaleProvider } from './locale';
import { Options } from './options';
import styles from './style.module.css';
import { applyTheme, ThemeProvider } from './theme';

const localeKey = 'locale';
const displayStyleKey = 'display-style';
const schemeKey = 'scheme';
const modeKey = 'mode';
const tzKey = 'timezone';
const staysKey = 'stays';

/**
 * 提供了对全局配置的更改
 */
export type OptionsSetter = ReturnType<typeof buildSetter>;

type OptionsGetSetter = Options & {
    setter?: OptionsSetter;
};

type OptionsGetSetContext = ReturnType<typeof createStore<OptionsGetSetter>>;

const optionsGetSetContext = createContext<OptionsGetSetContext>();

/**
 * 初始化当前组件的环境
 *
 * @remarks
 * 这是用于初始化项目的最外层组件，不保证任何属性是否有响应状态。
 */
export function OptionsProvider(props: ParentProps<Options>): JSX.Element {
    Hotkey.init(); // 初始化快捷键

    props = mergeProps({ locale: document.documentElement.lang || navigator.language }, props);

    I18n.init(props.locale!);
    const [messageResource] = createResource(true, async () => {
        for (const [key, loaders] of Object.entries(props.messages)) {
            await I18n.addDict(key, ...loaders);
        }
        return true;
    }, { initialValue: true });

    const [, opt] = splitProps(props, ['children']);
    const obj = createStore<OptionsGetSetter>(opt);
    obj[1]({ setter: buildSetter(obj) });

    if (opt.schemes && opt.scheme) { // 如果没有这两个值，说明不需要主题。
        applyTheme(document.documentElement, {
            scheme: (typeof opt.scheme === 'string') ? opt.schemes.get(opt.scheme) : opt.scheme,
            mode: opt.mode,
        });
    }

    // NOTE: 需要通过 messageResource.loading 等待 createResource 完成，才能真正加载组件。

    return <optionsGetSetContext.Provider value={obj}>
        <Switch fallback={<div class={styles.loading}><IconCmfxBrandAnimate /></div>}>
            <Match when={!messageResource.loading}>
                <ThemeProvider mode={obj[0].mode} styleElement={document.documentElement}
                    scheme={
                        typeof obj[0].scheme === 'string'
                            ? obj[0].schemes?.get(obj[0].scheme as string)
                            : obj[0].scheme as Scheme
                    }
                >
                    <LocaleProvider id={obj[0].locale!} displayStyle={obj[0].displayStyle} timezone={obj[0].timezone}>
                        {props.children}
                    </LocaleProvider>
                </ThemeProvider>
            </Match>
        </Switch>
    </optionsGetSetContext.Provider>;
}

/**
 * 获取组件库的顶层配置项及期衍生出来的一些操作方法
 *
 * @returns 返回一个元组，包含以下属性：
 * - 0: 组件库提供的其它方法；
 * - 1: 组件库初始化时的选项；
 */
export function useOptions(): [setter: OptionsSetter, options: Options] {
    const ctx = useContext(optionsGetSetContext);
    if (!ctx) { throw new Error('未找到正确的 optionsGetSetContext'); }
    return [ctx[0].setter!, ctx[0]];
}

export function buildSetter(ctx: OptionsGetSetContext) {
    const o = ctx[0];
    const set = ctx[1];

    const read = () => { // 从配置内容中读取
        set({
            scheme: o.config!.get(schemeKey) ?? o.scheme,
            mode: o.config!.get(modeKey) ?? o.mode,
            locale: o.config!.get(localeKey) ?? o.locale,
            displayStyle: o.config!.get(displayStyleKey) ?? o.displayStyle,
            timezone: o.config!.get(tzKey) ?? o.timezone,
            stays: o.config!.get(staysKey) ?? o.stays,
        });
    };

    read();

    return {
        /**
         * 设置 HTML 文档的标题
         */
        setTitle(v: string) {
            if (o.title) { v = v + o.titleSeparator + o.title; }
            document.title = v;
        },

        /**
         * 切换配置
         *
         * @remarks
         * 多用户环境，可以根据不同的用户 ID 切换不同的配置。
         *
         * @param id - 新配置的 ID，一般为用户 ID 等能表示用户唯一标记的值；
         */
        switchConfig(id: string | number) {
            o.config!.switch(id);
            read();
        },

        /**
         * 切换当前配置的全局语言
         *
         * @param id - 新语言的 ID
         */
        switchLocale(id: string): void {
            set({ locale: id });
            o.config!.set(localeKey, id);
            document.documentElement.lang = id;
        },

        /**
         * 切换当前配置的全局单位样式
         */
        switchDisplayStyle(style: DisplayStyle) {
            set({ displayStyle: style });
            o.config!.set(displayStyleKey, style);
        },

        /**
         * 切换当前配置的全局时区
         */
        switchTimezone(tz: string) {
            set({ timezone: tz });
            o.config!.set(tzKey, tz);
        },

        /**
         * 切换当前配置的全局主题色
         *
         * @param scheme - 新主题色的 ID 或 {@link Scheme} 对象，
         * 如果是对象类型，需要注意该值必须是能被 {@link structuredClone} 复制的，防止外部修改时，引起主题变化。
         */
        switchScheme(scheme: string | Scheme) {
            const s = structuredClone((typeof scheme === 'string') ? o.schemes!.get(scheme) : scheme);
            set({ scheme: s });
            o.config!.set(schemeKey, s);
        },

        /**
         * 切换当前配置的全局主题模式
         */
        switchMode(mode: Mode) {
            set({ mode: mode });
            o.config!.set(modeKey, mode);
        },

        /**
         * 通知当前配置的停留时间，单位为毫秒。
         */
        setStays(stay: number) {
            set({ stays: stay });
            o.config!.set(staysKey, stay);
        }
    };
}
