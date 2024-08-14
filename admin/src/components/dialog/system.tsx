// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useApp } from '@/app/context'; // 直接导入 app/context 而不是 app 是为了防止循环依赖
import { BaseProps } from '@/components/base';
import { Button } from '@/components/button';
import { FieldAccessor, TextField } from '@/components/form';
import { default as Dialog } from './dialog';

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
export default function(props: Props) {
    return <Portal>
        <Alert header={props.header} palette={props.palette} />
        <Confirm header={props.header} palette={props.palette} />
        <Prompt header={props.header} palette={props.palette} />
    </Portal>;
}

/**
 * 用于替代 window.alert 的组件
 *
 * 只需要在任意代码位置中插入此组件，之后即会自动替换 window.alert 方法。
 */
function Alert(props: Props) {
    const ctx = useApp();
    let dlg: HTMLDialogElement;
    const [msg, setMsg] = createSignal<any>();

    window.alert = (msg?: any) => {
        setMsg(msg);
        dlg.showModal();
    };

    return <Dialog {...props} ref={el => dlg = el} class='w-60' actions={
        <Button onClick={() => dlg.close()}>{ctx.t('_internal.ok')}</Button>
    }>
        {msg()}
    </Dialog>;
}

/**
 * 用于替代 window.confirm 的组件
 */
function Confirm(props: Props) {
    const ctx = useApp();
    let dlg: HTMLDialogElement;
    const [msg, setMsg] = createSignal<string>();

    window.confirm = (msg?: string): boolean => {
        setMsg(msg);
        dlg.showModal();
        return dlg.returnValue === 'true';
    };

    return <Dialog {...props} class='w-60' ref={el => dlg = el} actions={
        <>
            <Button onClick={() => dlg.close()}>{ctx.t('_internal.cancel')}</Button>
            <Button onClick={() => dlg.close('true')}>{ctx.t('_internal.ok')}</Button>
        </>
    }>
        <p>{msg()}</p>
    </Dialog>;
}

/**
 * 用于替代 window.prompt 的组件
 */
function Prompt(props: Props) {
    const ctx = useApp();
    let dlg: HTMLDialogElement;
    const [msg, setMsg] = createSignal<string>();
    const access = FieldAccessor('prompt', '', false);

    window.prompt = (msg?: string, val?: string): string | null => {
        setMsg(msg);
        access.setValue(val ?? '');
        dlg.showModal();
        return dlg.returnValue ?? null;
    };

    return <Dialog {...props} ref={el => dlg = el} class='w-60' actions={
        <>
            <Button onClick={() => dlg.close()}>{ctx.t('_internal.cancel')}</Button>
            <Button onClick={() => dlg.close(access.getValue())}>{ctx.t('_internal.ok')}</Button>
        </>
    }>
        <TextField label={msg()} accessor={access} />
    </Dialog>;
}
