// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Config, Contrast, Locale, Mode, Problem, Scheme, Theme, UnitStyle } from '@cmfx/core';
import { createContext, createEffect, createResource, JSX, ParentProps, Show, splitProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Portal } from 'solid-js/web';

import { registerLocales } from '@/chart/locale';
import { initDialog } from '@/dialog/system';
import { Hotkey } from '@/hotkey';
import { initNotify } from '@/notify/notify';
import { LocaleProvider } from './locale';
import { Options } from './options';

type Actions = ReturnType<typeof buildActions>;

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
 * NOTE: 这是用于初始化项目的最外层组件，不保存任何属性是否有响应状态。
 */
export function OptionsProvider(props: ParentProps<Options>): JSX.Element {
    Hotkey.init(); // 初始化快捷键。
    Locale.init(props.locale);

    const [_, p] = splitProps(props, ['children']);
    const obj = createStore<InternalOptions>(p);
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

        const api = await API.build(props.id+'-token', props.storage, props.apiBase, props.apiToken, props.apiContentType, props.apiAcceptType, props.locale);
        await api.clearCache(); // 刷新或是重新打开之后，清除之前的缓存。
        obj[1]({ api: api });

        return obj[0];
    }, {initialValue: p});

    createEffect(() => {
        const t = new Theme(data()!.scheme, data()!.mode, data()!.contrast);
        Theme.apply(document.documentElement, t);
    });

    // NOTE: 需要通过 data.loading 等待 createResource 完成，才能真正加载组件

    return <internalOptionsContext.Provider value={obj}>
        <Show when={!data.loading}>
            <LocaleProvider id={data()!.locale} unitStyle={data()!.unitStyle}>
                <Portal>
                    {initDialog(data()!.title, data()!.systemDialog)}
                    {initNotify(data()!.systemNotify, data()!.logo)}
                </Portal>
                {props.children}
            </LocaleProvider>
        </Show>
        <Show when={data.loading}>
            <div>Loading...</div>
        </Show>
    </internalOptionsContext.Provider>;
}

/**
 * 获取组件库的顶层配置项及期衍生出来的一些操作方法
 *
 * @returns 返回一个元组，包含以下属性：
 * - 0: API 对象；
 * - 1: 组件库提供的其它方法；
 * - 2: 组件库初始化时的选项；
 */
export function use() {
    const options = useInternalOptions()[0];
    return [options.api, options.actions, options] as [api: API, actions: Actions, options: Options];
}

function buildActions(ctx: InternalOptionsContext) {
    const options = ctx[0];
    const setOptions = ctx[1];

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
            // 保存旧配置
            options.config!.set('scheme', options.scheme);
            options.config!.set('contrast', options.contrast);
            options.config!.set('mode', options.mode);
            options.config!.set('locale', options.locale);
            options.config!.set('unit-style', options.unitStyle);

            options.config!.switch(id);

            setOptions({// 写入新配置
                scheme: options.config!.get('scheme') ?? options.scheme,
                contrast: options.config!.get('contrast') ?? options.contrast,
                mode: options.config!.get('mode') ?? options.mode,
                locale: options.config!.get('locale') ?? options.locale,
                unitStyle: options.config!.get('unit-style') ?? options.unitStyle,
            });
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
        switchScheme(scheme: Scheme | number) { setOptions({ scheme: scheme }); },

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