// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, Match, ParentProps, Switch } from 'solid-js';

import { BackTop, BackTopProps } from '@/backtop';
import { BaseProps, joinClass } from '@/base';
import { use, useLocale } from '@/context';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 配置 BackTop 组件
     *
     * @remarks 可以有以下取值：
     * - undefined 默认选项的 BackTop 组件；
     * - false 不显示 BackTop 组件；
     * - {@link BackTopProps} 自定义的 BackTop 组件属性；
     */
    backtop?: false | BackTopProps;

    /**
     * 页面标题的翻译 ID
     */
    title: string;
}

/**
 * 页面组件
 *
 * @remarks 默认是 flex-col 布局。如果有需要，可自行指定 class 进行修改。
 */
export function Page (props: Props): JSX.Element {
    const [, act] = use();
    const l = useLocale();

    createEffect(() => { act.setTitle(l.t(props.title)); });

    return <div class={joinClass(styles.page, props.palette ? `palette--${props.palette}` : '', props.class)}>
        {props.children}
        <Switch>
            <Match when={props.backtop === undefined}><BackTop /></Match>
            <Match when={props.backtop !== false}>
                {p => <BackTop {...p} />}
            </Match>
        </Switch>
    </div>;
}
