// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, Layout } from '@/base';

export type Props = ParentProps<{
    /**
     * 如果存在文字，表示文字的位置，否则该值无意义。
     *
     * 在 children 不为空的情况下，如果未指定 pos，会初始化 'start'。
     */
    pos?: 'start' | 'center' | 'end';

    /**
     * 组件布局方向
     */
    layout?: Layout;

    /**
     * 交叉轴上的留白
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

    return <div role="separator" aria-orientation={props.layout} style={{'padding-block': props.padding}} classList={{
        'c--divider': true,
        'vertical': props.layout !== 'horizontal',
        [`pos-${props.children ? (props.pos ?? 'none') : 'none'}`]: true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        {props.children}
    </div>;
}
