// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps } from 'solid-js';
import IconNoData from '~icons/oui/index-close';

import { BaseProps } from '@/base';
import Result from './result';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     *
     * @defaultValue '~icons/oui/index-close'
     * @reactive
     */
    icon?: JSX.Element;
}

const presetProps: Props = {
    icon: <IconNoData />
} as const;

/**
 * 表示没有数据的结果页
 */
export default function Empty(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    return <Result layout='vertical' class={props.class} gap='2px'
        palette={props.palette} illustration={props.icon}>
        {props.children}
    </Result>;
}
