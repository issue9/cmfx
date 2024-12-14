// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useOptions } from '@/components/context';
import { BaseProps } from '@/components/base';
import { FieldAccessor, TextField } from '@/components/form';
import { Dialog, Ref } from './dialog';

interface Props extends BaseProps {
    /**
     * 系统弹出框的标题
     */
    header?: string;
}

/**
 * 提供用于替换浏览器默认对话框的组件，包含了以下几种：
 *  - window.alert
 *  - window.confirm
 *  - window.prompt
 */
export function SystemDialog(props: BaseProps): JSX.Element {
    const opt = useOptions();
    return <Portal>
        <Alert header={opt.title} palette={props.palette} />
        <Confirm header={opt.title} palette={props.palette} />
        <Prompt header={opt.title} palette={props.palette} />
    </Portal>;
}

/**
 * 用于替代 window.alert 的组件
 *
 * 只需要在任意代码位置中插入此组件，之后即会自动替换 window.alert 方法。
 */
function Alert(props: Props): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<any>();

    window.alert = (msg?: any) => {
        setMsg(msg);
        dlg.showModal();
    };

    return <Dialog {...props} ref={el => dlg = el} class='w-60' actions={
        dlg!.OKAction(async() => { return 'ok'; })
    }>
        {msg()}
    </Dialog>;
}

/**
 * 用于替代 window.confirm 的组件
 */
function Confirm(props: Props): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<string>();

    window.confirm = (msg?: string): boolean => {
        setMsg(msg);
        dlg.showModal();
        return dlg.returnValue === 'true';
    };

    return <Dialog {...props} class='w-60' ref={el => dlg = el} actions={ dlg!.DefaultActions(async()=>'true')}>
        <p>{msg()}</p>
    </Dialog>;
}

/**
 * 用于替代 window.prompt 的组件
 */
function Prompt(props: Props): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<string>();
    const access = FieldAccessor('prompt', '', false);

    window.prompt = (msg?: string, val?: string): string | null => {
        setMsg(msg);
        access.setValue(val ?? '');
        dlg.showModal();
        return dlg.returnValue ?? null;
    };

    return <Dialog {...props} ref={el => dlg = el} class='w-60' actions={ dlg!.DefaultActions(async()=>access.getValue())}>
        <TextField label={msg()} accessor={access} />
    </Dialog>;
}
