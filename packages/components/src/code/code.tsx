// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { BundledLanguage } from 'shiki/bundle/full';
import { createEffect, createSignal, JSX } from 'solid-js';
import { template } from 'solid-js/web';

import { BaseProps, joinClass } from '@/base';
import { highlightCode } from './shiki';

export interface Props extends BaseProps {
    /**
     * 代码
     *
     * @reactive
     */
    children: string;

    /**
     * 是否可编辑
     *
     * @remarks 编辑内容并不会重新渲染内容，一些高亮内容可能不再准确。
     * @reactive
     */
    editable?: boolean;

    /**
     * 修改内容触发的事件
     *
     * @remarks 仅在 {@link Props#editable} 为 true 时生效。
     */
    oninput?: { (value: string): void; };

    /**
     * 内容自动换行
     *
     * @reactive
     */
    wrap?: boolean;

    /**
     * 高亮的语言名称，如果为空则为 text。
     *
     * @reactive
     */
    lang?: BundledLanguage;

    /**
     * 是否显示行号如果为 Number 类型则表示起始行号。
     *
     * @reactive
     */
    ln?: number;
}

/**
 * 代码显示组件，并没有高亮功能。
 *
 * @remarks 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export default function Code(props: Props): JSX.Element {
    const [html, setHTML] = createSignal<HTMLElement>();

    createEffect(async () => {
        const cls = joinClass(props.palette ? `palette--${props.palette}` : undefined, props.class);
        const el = template(await highlightCode(props.children, props.lang, props.ln, props.wrap, cls))() as HTMLElement;
        setHTML(el);
    });

    createEffect(() => {
        const el = html();
        if (!el) { return; }

        el.contentEditable = props.editable ? 'plaintext-only' : 'false';
        el.addEventListener('input', e => {
            const txt = (e.currentTarget as HTMLElement).innerText;
            props.children = txt;
            if (props.oninput) { props.oninput(txt); }
        });
    });

    return <>{html()}</>;
}
