// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, Match, mergeProps, splitProps, Switch } from 'solid-js';

import { Color } from '@/components/base';
import { ButtonStyle, XButton, XIconButton } from '@/components/button';

export interface Props {
    color?: Color;

    style?: ButtonStyle;

    rounded?: boolean;

    disabled?: boolean;

    title?: string;

    /**
     * 按钮图标，在 text 和 icon 均为空的情况下，icon 会被设置 more_horiz。
     * 与 text 只能同时设置一个值，如果同时存在，优先 text。
     */
    icon?: string;

    /**
     * 按钮内容的元素
     */
    text?: JSX.Element;

    ref?: { (r:Ref) :void };

    pos?: Position;

    children: JSX.Element;
}

export const positions = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Position = typeof positions[number];

/**
 * Dropdown 外放的接口
 */
export interface Ref {
    /**
     * 是否显示下拉部分的界面
     *
     * @param v true 表示显示,false 表示关闭。
     */
    visible(v: boolean): void;
}

const defaultProps: Partial<Props> = {
    color: undefined,
    icon: 'more_horiz',
    pos: 'bottomright'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    const [btnProps, _] = splitProps(props, ['style', 'rounded', 'disabled', 'title']);
    const [show, setShow] = createSignal(false);

    props.ref?.({
        visible(v: boolean) { setShow(v); }
    });

    const button = <Switch>
        <Match when={props.text}>
            <XButton {...btnProps} onClick={()=>setShow(!show())}>{props.text}</XButton>
        </Match>
        <Match when={!props.text}>
            <XIconButton {...btnProps} onClick={() => setShow(!show())}>{props.icon}</XIconButton>
        </Match>
    </Switch>;

    return <div classList={{
        'dropdown': true,
        [`scheme--${props.color}`]: !!props.color
    }}>
        {button}

        <div classList={{
            'content': true,
            [`${props.pos}`]: true,
            'show': show()
        }}>
            {props.children}
        </div>
    </div>;
}
