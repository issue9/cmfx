// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, JSX, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, classList, Layout, style2String } from '@/base';
import styles from './style.module.css';

export type Props = ParentProps<{
    /**
     * 如果存在文字，表示文字的位置，否则该值无意义。
     *
     * @remarks 在 children 不为空的情况下，如果未指定 pos，会初始化 'start'。
     */
    pos?: 'start' | 'center' | 'end';

    /**
     * 组件布局方向
     */
    layout?: Layout;

    /**
     * 交叉轴上的留白
     *
     * @remarks 语法与 CSS 中的 padding-block 和 padding-inline 相同。可以用一个值或是两个值：
     *  - padding: 10px；
     *  - padding: 10px 10px；
     *  - padding: 5% 10%；
     */
    padding?: string;
} & BaseProps>;

const presetProps: Readonly<Props> = {
    pos: 'start',
    layout: 'horizontal'
};

/**
 * 分割线
 */
export function Divider(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const style = createMemo(()=>{
        const s = { [props.layout === 'horizontal' ? 'padding-block' : 'padding-inline']: props.padding };
        if (!props.style) { return s; }
        if (typeof props.style === 'string') {
            return style2String(s) + ';' + props.style;
        }
        return { ...s, ...props.style };
    });

    return <div role="separator" aria-orientation={props.layout} style={style()}
        class={classList(props.palette, {
            [styles.vertical]: props.layout !== 'horizontal',
            [styles[`pos-${props.children ? (props.pos ?? 'none') : 'none'}`]]: true,
        }, styles.divider, props.class)}>
        {props.children}
    </div>;
}
