// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { useApp } from '@/app/context';
import { handleEvent } from '@/components/base';
import { calcPopoverPos } from '@/components/utils';
import Button, { Props as BaseProps, Ref as ButtonRef, presetProps } from './button';
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
    props = mergeProps(presetProps, props);
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
        <Button ref={(el)=>btn=el} {...btnProps} palette={props.palette} onClick={() => {
            pop.togglePopover();
            calcPopoverPos(pop, btn.getBoundingClientRect());
        }}>{props.children}</Button>
        <div popover="manual" ref={el=>pop=el} classList={{'c--confirm-button-panel':true, [`palette--${props.palette}`]:!!props.palette }}>
            {props.prompt ?? ctx.locale().t('_i.areYouSure')}
            <div class="actions">
                <Button palette='secondary' onClick={() => pop.hidePopover()}>{props.cancel ?? ctx.locale().t('_i.cancel')}</Button>
                <Button palette='primary' autofocus onClick={confirm}>{props.ok ?? ctx.locale().t('_i.ok')}</Button>
            </div>
        </div>
    </>;
}
