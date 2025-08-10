// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { IconComponent } from '@/icon';
import { Label } from './label';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     */
    icon?: IconComponent;

    /**
     * 标题
     */
    title?: string;
}

/**
 * 一长段内容的描述信息，可带一个标题。
 */
export function Description(props: Props): JSX.Element {
    return <div class={joinClass(styles.description, props.palette ? `palette--${props.palette}` : '', props.class)}>
        <Show when={props.icon || props.title}>
            <Label class={styles.title} palette={props.palette} icon={props.icon}>{ props.title }</Label>
        </Show>
        <div class={styles.desc}>
            { props.children }
        </div>
    </div>;
}
