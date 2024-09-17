// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { useApp } from '@/app/context';
import { handleEvent } from '@/components/base';
import Button, { Props as BaseProps, Ref as ButtonRef, defaultProps } from './button';
import { ClickFunc } from './types';

export interface Props extends BaseProps {
    /**
     * 确认框的提示内容，如果为空会显示一条默认的提示语句。
     */
    prompt?: JSX.Element;

    /**
     * 自定义确定按钮上的内容
     */
    ok?: JSX.Element;

    /**
     * 自定义取消按钮上的内容
     */
    cancel?: JSX.Element;

    /**
     * 点击事件
     *
     * 这将在用户点击确认按钮之后执行。
     */
    onClick: ClickFunc; // 此处重新声明只是为了将可选字段变为必填字段。
}

/**
 * 带确认功能的按钮
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    const ctx = useApp();
    let pop: HTMLDivElement;
    let btn: ButtonRef;

    const [_, btnProps] = splitProps(props, ['children', 'onClick', 'prompt', 'palette', 'ok', 'cancel']);

    const handleClick = (e: MouseEvent) => {
        if (!pop.contains(e.target as Node) && !btn.contains(e.target as Node)) {
            pop.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    const confirm: ClickFunc = (e) => {
        handleEvent(props.onClick, e);
        pop.hidePopover();
    };

    return <>
        <Button ref={(el)=>btn=el} {...btnProps} onClick={() => {
            pop.togglePopover();

            // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
            const rect = btn.getBoundingClientRect();
            pop.style.top = rect.bottom + 'px';
            pop.style.left = rect.left + 'px';
        }}>{props.children}</Button>
        <div popover="manual" ref={el=>pop=el} classList={{'c--confirm-button-panel':true, [`palette--${props.palette}`]:!!props.palette }}>
            {props.prompt ?? ctx.t('_i.areYouSure')}
            <div class="actions">
                <Button palette='secondary' onClick={() => pop.hidePopover()}>{props.cancel ?? ctx.t('_i.cancel')}</Button>
                <Button palette='primary' autofocus onClick={confirm}>{props.ok ?? ctx.t('_i.ok')}</Button>
            </div>
        </div>
    </>;
}
