// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps } from 'solid-js';

import { BaseProps } from '@/components/base';
import Label from './label';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     */
    icon?: string;

    /**
     * 标题
     */
    title: string;
}

export default function(props: Props): JSX.Element {
    return <div class="flex flex-col">
        <Label icon={props.icon}>{ props.title }</Label>
        { props.children }
    </div>;
}
