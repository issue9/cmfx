// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { BundledLanguage } from 'shiki/bundle/full';
import { createEffect, createSignal, JSX, Show } from 'solid-js';
import { template } from 'solid-js/web';
import IconCopy from '~icons/material-symbols/content-copy';

import { BaseProps, joinClass, Palette } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { copy2Clipboard } from '@/kit';
import { highlightCode } from './shiki';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 按钮的调色盘
     *
     * @reactive
     */
    accentPalette?: Palette;

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
    break?: boolean;

    /**
     * 高亮的语言名称，如果为空则为 text。
     *
     * @reactive
     */
    lang?: BundledLanguage;
}

/**
 * 代码显示组件，并没有高亮功能。
 *
 * @remarks 采用 [shiki/bundle/full](https://shiki.tmrs.site/) 作为语法高亮功能。
 * 当前库并没有打包 shiki/bundle/full，用户需要自己在 package.json 的 dependencies 中导入该包才有高亮功能。
 */
export default function Code(props: Props): JSX.Element {
    const l = useLocale();
    const [html, setHTML] = createSignal<HTMLElement>();

    createEffect(async () => {
        const el = template(await highlightCode(props.children, props.lang))() as HTMLElement;
        setHTML(el);
    });

    createEffect(() => {
        const el = html();
        if (!el) { return; }

        if (props.break) {
            el.classList.add(styles.break);
        } else {
            el.classList.remove(styles.break);
        }

        el.contentEditable = props.editable ? 'plaintext-only' : 'false';
        el.addEventListener('input', e => {
            if (props.oninput) { props.oninput((e.currentTarget as HTMLElement).innerText); }
        });
    });

    return <div class={joinClass(styles.code, props.palette ? `palette--${props.palette}` : undefined, props.class)}>
        <Show when={props.lang}>
            <span class={styles.lang}>{props.lang}</span>
        </Show>

        <Button title={l.t('_c.copy')} onclick={e => copy2Clipboard(e.currentTarget, props.children)}
            class={joinClass(styles.action, props.accentPalette ? `palette--${props.accentPalette}` : undefined)}>
            <IconCopy />
        </Button>

        {html()}
    </div>;
}
