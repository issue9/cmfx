// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale, Problem, UnitStyle } from '@cmfx/core';
import { createContext, createResource, ParentProps, useContext } from 'solid-js';

import { initDialog } from '@/dialog/system';
import { initNotify, notify, Type as NotifyType } from '@/notify/notify';
import { Options } from './options';

const context = createContext<Context>();

const optionsContext = createContext<Options>();

export type Context = ReturnType<typeof init>['context'];

/**
 * 内部使用配置项
 */
export function useOptions(): Options {
    const ctx = useContext(optionsContext);
    if (!ctx) {
        throw '未找到正确的 optionsContext';
    }
    return ctx;
}

/**
 * 获取组件需要使用接口
 */
export function useComponents(): Context {
    const ctx = useContext(context);
    if (!ctx) {
        throw '未找到正确的 localeContext';
    }
    return ctx;
}

/**
 * 初始化当前组件的环境
 *
 * @param o 初始化参数；
 */
export function init(o: Options) {
    let localeID: string | undefined;
    let unitStyle: UnitStyle | undefined;

    const [locale, localeData] = createResource<Locale>(() => {
        return new Locale(o.config, localeID, unitStyle);
    });

    const val = {
        locale(): Locale { return locale()!; },

        /**
         * 设置 HTML 文档的标题
         */
        set title(v: string) {
            if (!v) { v = v + o.titleSeparator + o.title; }
            document.title = v;
        },

        /**
         * 返回与后端交互的 API 对象
         */
        get api() { return o.api; },

        /**
         * 切换语言
         *
         * @param id 新语言的 ID
         */
        switchLocale(id: string): void {
            localeID = id;
            localeData.refetch();
        },

        /**
         * 切换单位样式
         *
         * @param style 单位样式
         */
        switchUnitStyle(style: UnitStyle) {
            unitStyle = style;
            localeData.refetch();
        },

        /**
         * 发送一条通知给用户
         *
         * @param title 标题；
         * @param body 具体内容，如果为空则只显示标题；
         * @param type 类型，仅对非系统通知的情况下有效；
         * @param timeout 如果大于 0，超过此毫秒数时将自动关闭提法；
         */
        async notify(title: string, body?: string, type: NotifyType = 'error', timeout = 5000) {
            await notify(title, body, type, this.locale().locale.language, timeout);
        },

        /**
         * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
         *
         * @param p 如果该值空，则会抛出异常；
         */
        async outputProblem<P>(p?: Problem<P>): Promise<void> { await o.outputProblem(p); },
    };

    const p = (props: ParentProps) => (
        <context.Provider value={val}>
            { initDialog(o.title, o.systemDialog) }
            { initNotify(o.systemNotify, o.logo) }
            <optionsContext.Provider value={o}>
                {props.children}
            </optionsContext.Provider>
        </context.Provider>
    );
    return { context: val, Provider: p };
}
