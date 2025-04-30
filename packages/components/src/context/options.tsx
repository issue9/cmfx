// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Config, Contrast, DictLoader, Locale, Mimetype, Mode, Problem, Scheme, Theme, UnitStyle } from '@cmfx/core';
import { createContext, createResource, JSX, onMount, ParentProps, Show, splitProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Portal } from 'solid-js/web';

import { registerLocales } from '@/chart/locale';
import { initDialog } from '@/dialog/system';
import { Hotkey } from '@/hotkey';
import { initNotify } from '@/notify/notify';
import { LocaleProvider } from './locale';
import { ThemeProvider } from './theme';

/**
* 组件库的全局配置项
*/
export interface Options {
    /**
     * 该项目的唯一 ID
     */
    id: string;

    /**
     * 一些配置项的保存位置
     */
    storage: Storage;

    /**
     * 默认的主题样式
     */
    scheme: Scheme | number;

    /**
     * 默认的主题明暗度
     */
    contrast: Contrast;

    /**
     * 默认的主题模式
     */
    mode: Mode;

    /**
     * 初始的本地化语言 ID
     */
    locale: string;

    /**
     * 本地化的量词风格
     */
    unitStyle: UnitStyle;

    /**
     * 当前支持的语言列表以及加载方法
     */
    messages: Record<string, Array<DictLoader>>;

    /**
     * API 访问的基地址
     */
    apiBase: string;

    /**
     * API 令牌的续订地址
     */
    apiToken: string;

    /**
     * API 接收的媒体类型
     */
    apiAcceptType: Mimetype;

    /**
     * API 提交的媒体类型
     */
    apiContentType: Mimetype;

    /**
     * 网站的标题
     *
     * 如果不会空，会和 {@link Options#titleSeparator} 组成页面标题的后缀。
     */
    title: string;

    /**
     * 网页标题的分隔符
     */
    titleSeparator: string;

    /**
     * 网页 LOGO
     */
    logo?: string;

    /**
     * 分页符中页码选项的默认值
     */
    pageSizes: Array<number>;

    /**
     * 表格等需要分页对象的每页默认数量
     */
    pageSize: number;

    /**
     * 是否采用系统级别的通知
     */
    systemNotify?: boolean;

    /**
     * 是否替换浏览器提供的 alert、prompt 和 confirm 三个对话框
     */
    systemDialog?: boolean;

    /**
     * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
     *
     * @param p 如果该值空，则会抛出异常；
     */
    outputProblem<P>(p?: Problem<P>): Promise<void>;
}

type InternalOptions = Options & {
    api?: API;
    config?: Config;
    uid?: number | string; // 仅用于 switchConfig 中的状态更换
};

type OptionsContext = ReturnType<typeof createStore<InternalOptions>>;

const optionsContext = createContext<OptionsContext>();

/**
 * 返回 API 对象
 */
export function useAPI(): API {
    const ctx = useInternalOptions();
    return ctx[0].api!;
}

/**
 * 返回组件提供的一些常规操作
 */
export function useActions () {
    const ctx = useInternalOptions();
    const setOptions = ctx[1];
    const options = ctx[0];

    return {
        /**
         * 设置 HTML 文档的标题
         */
        set title(v: string) {
            if (!v) { v = v + options.titleSeparator + options.title; }
            document.title = v;
        },

        /**
         * 切换配置
         *
         * @param id 新配置的 ID；
         */
        switchConfig(id: string | number) {
            options.config!.switch(id);
            setOptions({ uid: id });
        },

        /**
         * 切换语言
         *
         * @param id 新语言的 ID
         */
        switchLocale(id: string): void { setOptions({ locale: id }); },

        /**
         * 切换单位样式
         *
         * @param style 单位样式
         */
        switchUnitStyle(style: UnitStyle) { setOptions({ unitStyle: style }); },

        /**
         * 切换主题色
         */
        switchScheme(scheme: Scheme) { setOptions({ scheme: scheme }); },

        /**
         * 切换主题模式
         */
        switchMode(mode: Mode) { setOptions({ mode: mode }); },

        /**
         * 切换主题的明亮度
         */
        switchContrast(contrast: Contrast) { setOptions({ contrast: contrast }); },

        /**
         * 输出 Problem 类型的数据
         */
        async outputProblem<T = unknown>(problem?: Problem<T>): Promise<void> {
            await options.outputProblem(problem);
        }
    };
}

/**
 * 返回初始化时传递的选项
 */
export function useOptions() { return useInternalOptions()[0]; }

function useInternalOptions(): OptionsContext {
    const ctx = useContext(optionsContext);
    if (!ctx) {
        throw '未找到正确的 optionsContext';
    }
    return ctx;
}

/**
 * 初始化当前组件的环境
 */
export function OptionsProvider(props: ParentProps<Options>): JSX.Element {
    Hotkey.init(); // 初始化快捷键。

    const [_, p] = splitProps(props, ['children']);
    const obj = createStore<InternalOptions>(p);

    // 加载本地化语言
    Locale.init(props.locale);
    const [data] = createResource(true, async () => {
        for (const [key, loaders] of Object.entries(props.messages)) {
            await Locale.addDict(key, ...loaders);
            await registerLocales(key); // 加载图表组件的本地化语言
        }

        const api = await API.build(props.id, props.storage, props.apiBase, props.apiToken, props.apiContentType, props.apiAcceptType, props.locale);
        await api.clearCache(); // 刷新或是重新打开之后，清除之前的缓存。
        obj[1]({ api: api, config: new Config(props.id, '', props.storage) });
        return obj[0];
    }, {initialValue: p});

    onMount(() => { // 确保根元素的主题是正常的
        const t = new Theme(data()!.scheme, data()!.mode, data()!.contrast);
        Theme.apply(document.documentElement, t);
    });

    return <optionsContext.Provider value={obj}>
        <Show when={!data.loading}>
            <ThemeProvider scheme={data()!.scheme} contrast={data()!.contrast} mode={data()!.mode}>
                <LocaleProvider id={data()!.locale} unitStyle={data()!.unitStyle}>
                    <Portal>
                        {initDialog(data()!.title, data()!.systemDialog)}
                        {initNotify(data()!.systemNotify, data()!.logo)}
                    </Portal>
                    {props.children}
                </LocaleProvider>
            </ThemeProvider>
        </Show>
        <Show when={data.loading}>
            <div>Loading...</div>
        </Show>
    </optionsContext.Provider>;
}