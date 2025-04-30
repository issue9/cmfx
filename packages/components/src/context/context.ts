// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Contrast, Mode, Problem, Scheme, UnitStyle } from '@cmfx/core';

import { Options, useInternalOptions } from './options';

/**
 * 获取组件库的顶层配置项及期衍生出来的一些操作方法
 *
 * @returns 返回一个对象，包含以下方法：
 * - 0: API 对象；
 * - 1: 组件库提供的其它方法；
 * - 2: 组件库初始化时的选项；
 */
export function use() {
    const ctx = useInternalOptions();
    const setOptions = ctx[1];
    const options = ctx[0];

    const actions = {
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

    return [options.api!, actions, options] as [api: API, actions: typeof actions, options: Options];
}