// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show } from 'solid-js';
import IconCopy from '~icons/material-symbols/content-copy';

import { BaseProps, joinClass, Palette } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { copy2Clipboard } from '@/kit';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 是否显示复制按钮
     */
    copyable?: boolean;

    /**
     * 按钮的调色盘
     */
    accentPalette?: Palette;

    /**
     * 代码，字符串中的 < 和 > 会被转码。
     */
    children: string;

    /**
     * 是否可编辑
     */
    editable?: boolean;

    /**
     * 修改内容触发的事件
     *
     * NOTE: 仅在 {@link Props#editable} 为 true 时生效。
     */
    oninput?: { (value: string | null): void; };

    /**
     * 内容自动换行
     */
    break?: boolean;

    class?: string;
}

/**
 * 代码显示组件，并没有高亮功能。
 */
export default function Code(props: Props): JSX.Element {
    const l = useLocale();

    return <div class={joinClass(styles.code, props.palette ? `palette--${props.palette}` : undefined, props.class)}>
        <pre contentEditable={props.editable} class={props.break ? styles.break: undefined} oninput={e => {
            if (props.oninput) { props.oninput(e.currentTarget.innerText); }
        }}>{props.children}</pre>
        <Show when={props.copyable}>
            <Button title={l.t('_c.copy')} onclick={e => copy2Clipboard(e.currentTarget, props.children)}
                class={joinClass(styles.action, props.accentPalette ? `palette--${props.accentPalette}` : undefined)}>
                <IconCopy />
            </Button>
        </Show>
    </div>;
}
