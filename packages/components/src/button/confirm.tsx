// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey, pop } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { handleEvent, joinClass } from '@/base';
import { useLocale } from '@/context';
import { Props as BaseProps, Button, Ref as ButtonRef, presetProps } from './button';
import styles from './style.module.css';

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
    onClick: NonNullable<BaseProps['onClick']>; // 此处重新声明只是为了将可选字段变为必填字段。
}

/**
 * 带确认功能的按钮
 */
export function ConfirmButton(props: Props) {
    props = mergeProps(presetProps, props);
    const l = useLocale();
    let popElem: HTMLDivElement;
    let ref: ButtonRef;

    const [_, btnProps] = splitProps(props, ['children', 'onClick', 'prompt', 'palette', 'ok', 'cancel']);

    const hidePopover = (e: MouseEvent) => {
        if (!popElem.contains(e.target as Node) && !ref.contains(e.target as Node)) {
            popElem.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', hidePopover);
        if (props.hotkey) { Hotkey.bind(props.hotkey, () => { ref.click(); }); }
    });
    onCleanup(() => {
        document.body.removeEventListener('click', hidePopover);
        if (props.hotkey) { Hotkey.unbind(props.hotkey); }
    });

    const confirm: BaseProps['onClick'] = (e) => {
        handleEvent(props.onClick, e);
        popElem.hidePopover();
    };

    return <>
        <Button ref={(el) => ref = el} {...btnProps} palette={props.palette} onClick={() => {
            popElem.togglePopover();
            pop(popElem, ref.getBoundingClientRect());
        }}>{props.children}</Button>
        <div popover="manual" ref={el=>popElem=el} class={joinClass(props.palette ? `palette--${props.palette}`:undefined, styles['confirm-panel'])}>
            {props.prompt ?? l.t('_c.areYouSure')}
            <div class={styles['confirm-actions']}>
                <Button palette='secondary' onClick={() => popElem.hidePopover()}>{props.cancel ?? l.t('_c.cancel')}</Button>
                <Button palette='primary' autofocus onClick={confirm}>{props.ok ?? l.t('_c.ok')}</Button>
            </div>
        </div>
    </>;
}
