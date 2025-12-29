// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { handleEvent, joinClass } from '@/base';
import { useLocale } from '@/context';
import { AProps, Props as BaseProps, BProps, Button, Ref as ButtonRef, presetProps } from './button';
import styles from './style.module.css';

interface Base {
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
}

export type Props = Base & AProps | Base & BProps;

/**
 * 带确认功能的按钮
 */
export function ConfirmButton(props: Props) {
    props = mergeProps(presetProps, props) as Props;
    const l = useLocale();
    let popElem: HTMLDivElement;
    let ref: ButtonRef;

    const [_, btnProps] = splitProps(props, ['children', 'onclick', 'prompt', 'palette', 'ok', 'cancel', 'ref']);

    onMount(() => {
        if (props.hotkey) { Hotkey.bind(props.hotkey, () => { ref!.root().click(); }); }
    });
    onCleanup(() => {
        if (props.hotkey) { Hotkey.unbind(props.hotkey); }
    });

    const nav = useNavigate();
    const confirm: BaseProps['onclick'] = e => {
        if (props.onclick) { handleEvent(props.onclick, e); }

        if (props.type === 'a') { nav(props.href!); }

        popElem.hidePopover();
    };

    return <>
        <Button ref={el => ref = el} {...btnProps as any} palette={props.palette} onclick={e => {
            e.preventDefault(); // 取消默认动作，比如 type='a' 时的跳转
            popElem.togglePopover();
            adjustPopoverPosition(popElem, ref.root().getBoundingClientRect());
        }}>
            {props.children}
        </Button>

        <div popover="auto" ref={el => popElem = el} class={joinClass(props.palette, styles['confirm-panel'])}>
            {props.prompt ?? l.t('_c.areYouSure')}
            <div class={styles['confirm-actions']}>
                <Button palette='secondary' onclick={() => popElem.hidePopover()}>
                    {props.cancel ?? l.t('_c.cancel')}
                </Button>

                <Button palette='primary' ref={el => el.root().autofocus = true} onclick={confirm}>
                    {props.ok ?? l.t('_c.ok')}
                </Button>
            </div>
        </div>
    </>;
}
