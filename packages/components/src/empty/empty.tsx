// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps } from 'solid-js';
import IconNoData from '~icons/oui/index-close';

import { BaseProps, joinClass } from '@/base';
import { IconComponent } from '@/icon';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 自定义图标
     *
     * 默认为 oui/index-close
     */
    icon?: IconComponent;
}

const presetProps: Props = {
    icon: IconNoData
} as const;

/**
 * 表示空数据的组件
 */
export default function Empty(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <div class={joinClass(styles.nodata, props.palette ? `palette--${props.palette}` : '', props.class)}>
        {props.icon!({ class: styles.icon })}
        {props.children}
    </div>;
}
