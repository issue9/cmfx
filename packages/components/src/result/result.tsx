// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, JSX, mergeProps, ParentProps, Show } from 'solid-js';

import { BaseProps, joinClass, Layout, PropsError, style2String } from '@components/base';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 显示可选的插画
     *
     * @reactive
     */
    illustration?: JSX.Element;

    /**
     * 页面标题
     *
     * @reactive
     */
    title?: string;

    /**
     * 描述内容
     *
     * @reactive
     */
    description?: string;

    /**
     * 布局
     *
     * @remarks 可以有以下取值：
     * - `vertical`：垂直布局，插画在上方，标题和描述内容在下方；
     * - `horizontal`：水平布局，插画在左侧，标题和描述内容在右侧；
     * - `auto`：自动选择布局，根据内容的长度来决定是水平还是垂直布局；
     *
     * @reactive
     * @defaultValue 'auto'
     */
    layout?: Layout | 'auto';

    /**
     * 插画和文本内容之间的间距
     *
     * @reactive
     * @defaultValue '2.5rem'
     */
    gap?: string;
}

const presetProps: Readonly<Props> = {
    layout: 'auto',
    gap: '2.5rem'
} as const;

/**
 * 结果页面
 *
 * @remarks 组件件会被分成两部分，插图和文本内容，两都可以为空，但不能同时为空。
 */
export default function Result(props: Props) {
    props = mergeProps(presetProps, props);

    if (!props.illustration && !props.children) {
        throw new PropsError('children,illustration', '不能为空');
    }

    const cls = createMemo(() => {
        return joinClass(
            props.palette,
            styles.result,
            props.layout === 'auto' ? styles.auto : (props.layout === 'vertical' ? styles.vertical : styles.horizontal),
            props.class,
        );
    });

    return <div class={cls()} style={style2String({ '--result-gap': props.gap }, props.style)}>
        <Show when={props.illustration}>
            {c => <div aria-hidden="true" class={styles.illustration}>{c()}</div>}
        </Show>

        <Show when={props.children || props.title || props.description}>
            <div class={styles.content}>
                <Show when={props.title}>{c => <h2 class={styles.title}>{c()}</h2>}</Show>

                <Show when={props.description}>{c => <p class={styles.description}>{c()}</p>}</Show>

                {props.children}
            </div>
        </Show>
    </div>;
}
