// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Match, mergeProps, ParentProps, Switch } from 'solid-js';

import { BaseProps } from '@/components/base';
import { JSX } from 'solid-js';
import { Style } from './types';

export type Props = ParentProps<{
    /**
     * 如果存在文字，表示文字的位置
     */
    pos?: 'start' | 'center' | 'end';

    /**
     * 线的风格。
     */
    style?: Style;

    /**
     * 交叉轴上的留白
     */
    padding?: string;
} & BaseProps>;

const presetProps: Readonly<Props> = {
    style: 'solid',
    pos: 'start'
};

export function Divider(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <div role="separator" aria-orientation="horizontal" style={{'padding-block': props.padding}} classList={{
        'c--divider': true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        <Switch fallback={<hr style={{'border-style': props.style}} class="w-full" />}>
            <Match when={props.pos === 'start' && props.children}>
                {props.children}<hr style={{ 'border-style': props.style }} class="flex-1 ml-2" />
            </Match>
            <Match when={props.pos === 'center' && props.children}>
                <hr style={{ 'border-style': props.style }} class="flex-1 mr-2" />{props.children}<hr style={{ 'border-style': props.style }} class="flex-1 ml-2" />
            </Match>
            <Match when={props.pos === 'end' && props.children}>
                <hr style={{ 'border-style': props.style }} class="flex-1 mr-2" />{props.children}
            </Match>
        </Switch>
    </div>;
}
