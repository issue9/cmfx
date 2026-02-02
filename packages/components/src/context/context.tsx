// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { DisplayStyle, Hotkey, I18n } from '@cmfx/core';
import { createContext, createResource, JSX, Match, ParentProps, splitProps, Switch, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Mode, Scheme } from '@components/base';
import { ContextNotFoundError } from './errors';
import { LocaleProvider } from './locale';
import { ReqOptions } from './options';
import { ThemeProvider } from './theme';

const localeKey = 'locale';
const displayStyleKey = 'display-style';
const schemeKey = 'scheme';
const modeKey = 'mode';
const tzKey = 'timezone';
const staysKey = 'stays';
const systemNotifyKey = 'system-notify';
const fontSizeKey = 'font-size';
const transitionDurationKey = 'transition-duration';

/**
 * 提供了对全局配置的存取功能
 */
export type OptionsAccessor = ReturnType<typeof buildAccessor>;

interface OptionsContext {
    origin: Readonly<ReqOptions>;
    accessor: OptionsAccessor;
}

const optionsContext = createContext<OptionsContext>();

/**
 * 初始化当前组件的环境
 *
 * @remarks
 * 这是用于初始化项目的最外层组件，不保证任何属性是否有响应状态。
 */
export function OptionsProvider(props: ParentProps<ReqOptions>): JSX.Element {
    Hotkey.init(); // 初始化快捷键

    I18n.init(props.locale);
    const [messageResource] = createResource(true, async () => {
        for (const [key, loaders] of Object.entries(props.messages)) {
            await I18n.addDict(key, ...loaders);
        }
        return true;
    }, { initialValue: true });

    const [, opt] = splitProps(props, ['children']);
    const accessor = buildAccessor(opt);

    // NOTE: 需要通过 messageResource.loading 等待 createResource 完成，才能真正加载组件。

    return <optionsContext.Provider value={{origin: opt, accessor: accessor}}>
        <Switch fallback={props.loading({})}>
            <Match when={!messageResource.loading}>
                <ThemeProvider mode={accessor.getMode()} styleElement={document.documentElement}
                    scheme={accessor.getScheme()}
                >
                    <LocaleProvider id={accessor.getLocale()} displayStyle={accessor.getDisplayStyle()}
                        timezone={accessor.getTimezone()}
                    >
                        {props.children}
                    </LocaleProvider>
                </ThemeProvider>
            </Match>
        </Switch>
    </optionsContext.Provider>;
}

/**
 * 获取组件库的顶层配置项及期衍生出来的一些操作方法
 *
 * @returns 返回一个元组，包含以下属性：
 * - 0: 提供对组件库选项的存取功能；
 * - 1: 组件库选项的原始值；
 */
export function useOptions(): [accessor: OptionsAccessor, origin: ReqOptions] {
    const ctx = useContext(optionsContext);
    if (!ctx) { throw new ContextNotFoundError('optionsContext'); }
    return [ctx.accessor, ctx.origin];
}

export function buildAccessor(o: ReqOptions) {
    const conf = o.config;

    const [val, set] = createStore({
        scheme: o.scheme,
        mode: o.mode,
        locale: o.locale,
        displayStyle: o.displayStyle,
        timezone: o.timezone,
        stays: o.stays,
        systemNotify: o.systemNotify,
        fontSize: o.fontSize,
        transitionDuration: o.transitionDuration,
    });

    const read = () => { // 从配置内容中读取
        set({
            scheme: conf.get(schemeKey) ?? val.scheme,
            mode: conf.get(modeKey) ?? val.mode,
            locale: conf.get(localeKey) ?? val.locale,
            displayStyle: conf.get(displayStyleKey) ?? val.displayStyle,
            timezone: conf.get(tzKey) ?? val.timezone,
            stays: conf.get(staysKey) ?? val.stays,
            systemNotify: conf.get(systemNotifyKey) ?? val.systemNotify,
            fontSize: conf.get(fontSizeKey) ?? val.fontSize,
            transitionDuration: conf.get(transitionDurationKey) ?? val.transitionDuration,
        });

        if (val.fontSize !== document.documentElement.style.fontSize) {
            document.documentElement.style.fontSize = val.fontSize;
        }
    };

    read();

    return {
        /**
         * 切换用户
         *
         * @remarks
         * 多用户环境，可以根据不同的用户 ID 切换不同的配置。
         *
         * @param id - 新配置的 ID，一般为用户 ID 等能表示用户唯一标记的值；
         */
        switchConfig(id: string): void {
            conf.switch(id);
            read();
        },

        /**
         * 重置配置项
         */
        reset() {
            this.setScheme(o.scheme);
            this.setMode(o.mode);
            this.setLocale(o.locale);
            this.setDisplayStyle(o.displayStyle);
            this.setTimezone(o.timezone);
            this.setStays(o.stays);
            this.setSystemNotify(o.systemNotify);
            this.setFontSize(o.fontSize);
            this.setTransitionDuration(o.transitionDuration);
        },

        /**
         * 设置 HTML 文档的标题
         */
        setTitle(v: string): void {
            if (o.title) { v = v + o.titleSeparator + o.title; }
            document.title = v;
        },

        /**
         * 设置字体大小
         *
         * @param size - 字段大小的有效值，比如 '16px' 或是 'clamp(min, preferred, max)' 等；
         */
        setFontSize(size: string): void {
            set({ fontSize: size });
            conf.set(fontSizeKey, size);
            document.documentElement.style.fontSize = size;
        },

        getFontSize(): string { return val.fontSize; },

        /**
         * 设置动画时长
         */
        setTransitionDuration(duration: number): void {
            set({ transitionDuration: duration });
            conf.set(transitionDurationKey, duration);
            document.documentElement.style.setProperty('--default-transition-duration', `${duration}ms`);
        },

        getTransitionDuration(): number { return val.transitionDuration; },

        /**
         * 设置当前配置的全局语言
         *
         * @param id - 新语言的 ID
         */
        setLocale(id: string): void {
            set({ locale: id });
            conf.set(localeKey, id);
            document.documentElement.lang = id;
        },

        getLocale(): string { return val.locale; },

        /**
         * 设置当前配置的全局单位样式
         */
        setDisplayStyle(style: DisplayStyle): void {
            set({ displayStyle: style });
            conf.set(displayStyleKey, style);
        },

        getDisplayStyle(): DisplayStyle { return val.displayStyle; },

        /**
         * 设置当前配置的全局时区
         */
        setTimezone(tz: string): void {
            set({ timezone: tz });
            conf.set(tzKey, tz);
        },

        getTimezone(): string { return val.timezone; },

        /**
         * 设置当前配置的全局主题色
         *
         * @param scheme - 新主题色的 ID 或 {@link Scheme} 对象，
         * 如果是对象类型，需要注意该值必须是能被 {@link structuredClone} 复制的，防止外部修改时，引起主题变化。
         */
        setScheme(scheme: string | Scheme): void {
            const s = structuredClone((typeof scheme === 'string') ? o.schemes.get(scheme) : scheme);
            if (!s) { throw new Error(`无效的主题: ${scheme}`); }

            set({ scheme: s });
            conf.set(schemeKey, s);
        },

        getScheme(): Scheme { return val.scheme; },

        /**
         * 设置当前配置的全局主题模式
         */
        setMode(mode: Mode): void {
            set({ mode: mode });
            conf.set(modeKey, mode);
        },

        getMode(): Mode { return val.mode; },

        /**
         * 设置当前配置中通知的停留时间，单位为毫秒。
         */
        setStays(stay: number): void {
            set({ stays: stay });
            conf.set(staysKey, stay);
        },

        getStays(): number { return val.stays; },

        /**
         * 是否启用系统通知
         */
        setSystemNotify(v: boolean): void {
            set({ systemNotify: v });
            conf.set(systemNotifyKey, v);
        },

        getSystemNotify(): boolean { return val.systemNotify; },

        /**
         * 清除当前用户的配置
         */
        clearStorage(): void { conf.clear(); }
    };
}
