// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';

import { useApp } from '@/app/context';
import { BaseProps } from '@/components/base';
import { Button, ButtonRef } from '@/components/button';

export interface Props extends BaseProps, ParentProps {
    /**
     * 指定页面标题，可以是翻译 ID
     */
    title: string;

    class?: string;

    classList?: JSX.CustomAttributes<HTMLElement>['classList'];

    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

/**
 * 页面组件
 *
 * 默认是 flex-col 布局。如果有需要，可自行指定 class 进行修改。
 */
export default function (props: Props) {
    const ctx = useApp();

    createEffect(() => {
        ctx.title = ctx.locale().t(props.title);
    });

    // 计算 class
    const [_, other] = splitProps(props, ['title', 'children']);
    if ('classList' in other) {
        other['classList'] = { ...other['classList'], 'c--page':true};
    } else {
        other['classList'] = { 'c--page': true };
    }

    let main: HTMLElement;

    let btn: ButtonRef;
    const scroll = ()=>{
        btn.style.visibility = main.scrollTop > 10 ? 'visible' : 'hidden';
    };

    onMount(()=>{
        main = document.getElementById('main-content')!;
        if (!main) {
            console.error('未找到 ID 为 main-content 的元素');
            main = btn.parentElement!;
        }

        scroll(); // 初始化状态
        main.addEventListener('scroll', scroll);
    });

    onCleanup(()=>{ main.removeEventListener('scroll', scroll); });

    return <div {...other}>
        {props.children}

        <Button palette='primary' ref={el=>btn=el} class="backtop" icon rounded onclick={()=>{
            main.scrollTo({top: 0, behavior: 'smooth'});
        }}>vertical_align_top</Button>
    </div>;
}