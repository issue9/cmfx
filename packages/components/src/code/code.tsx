// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { write2Clipboard } from '@cmfx/core';
import { JSX, Show } from 'solid-js';
import IconCopy from '~icons/material-symbols/content-copy';

import { BaseProps, joinClass, Palette } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
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

    class?: string;
}

/**
 * 代码显示组件，并没有高亮功能。
 */
export default function Code(props: Props): JSX.Element {
    const l = useLocale();

    return <div class={joinClass(styles.code, props.palette ? `palette--${props.palette}` : undefined, props.class)}>
        <pre>{props.children}</pre>
        <Show when={props.copyable}>
            <Button title={l.t('_c.copy')} onclick={() => write2Clipboard(props.children)}
                class={joinClass(styles.action, props.accentPalette ? `palette--${props.accentPalette}` : undefined)}>
                <IconCopy />
            </Button>
        </Show>
    </div>;
}
