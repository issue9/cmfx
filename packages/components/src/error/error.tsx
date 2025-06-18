// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { use } from '@/context';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 显示可选的插画
     *
     * NOTE: 这里会假定你添加的插画是一个正方形。
     */
    illustration?: JSX.Element;

    /**
     * 页面标题
     */
    title?: string;

    /**
     * 指定一些自定义的操作
     */
    children?: JSX.Element;
}

const presetProps: Readonly<Partial<Props>> = {
    palette: 'error',
};

/**
 * 显示错误信息的组件
 */
export  function Error(props: Props) {
    props = mergeProps(presetProps, props);
    const [, act] = use();

    act.setTitle(props.title ?? '');

    return <div class={joinClass(styles.error, props.palette ? `palette--${props.palette}` : undefined)}>
        {props.illustration }
        <Show when={props.children}>
            <div class={styles.content}>{props.children}</div>
        </Show>
    </div>;
}
