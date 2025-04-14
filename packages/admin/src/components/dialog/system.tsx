// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { BaseProps } from '@admin/components/base';
import { useOptions } from '@admin/components/context';
import { FieldAccessor, TextField } from '@admin/components/form';
import { Dialog, Ref } from './dialog';

interface Props extends BaseProps {
    /**
     * 系统弹出框的标题
     */
    header?: string;
}

/**
 * 提供了与 {@link alert}、{@link confirm} 和 {@link prompt} 的方法，
 * 可用于替换对应的浏览器方法。
 *
 * 如果选项中的 system.dialog 的值为 true，那么对应的系统方法也会被替换。
 */
export function SystemDialog(props: Props): JSX.Element {
    const opt = useOptions();

    if (opt.system.dialog) {
        window.alert = alert;
        window.confirm = confirm as any;
        window.prompt = prompt as any;
    }

    return <Portal>
        <Alert header={opt.title} palette={props.palette} />
        <Confirm header={opt.title} palette={props.palette} />
        <Prompt header={opt.title} palette={props.palette} />
    </Portal>;
}

/************************ alert *****************************/

let alertInst: { (msg: string): Promise<void> };

function Alert(props: Props): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<any>();

    alertInst = async (msg?: any): Promise<void> => {
        setMsg(msg);
        dlg.showModal();

        return new Promise<void>(resolve=>{
            dlg.addEventListener('close', () => resolve());
        });
    };

    return <Dialog {...props} ref={el => dlg = el} class='w-60' actions={
        dlg!.OKAction(async() => { return 'ok'; })
    }>
        {msg()}
    </Dialog>;
}

/**
 * 提供了与 {@link window#alert} 相同的功能，但是在行为上有些不同。
 * {@link window#alert} 是阻塞模式的，而当前函数则是异步函数。
 */
export async function alert(msg: string): Promise<void> { await alertInst(msg); }

/************************ confirm *****************************/

let confirmInst: { (msg?: string): Promise<boolean> };

function Confirm(props: Props): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<string>();

    confirmInst = (msg?: string): Promise<boolean> => {
        setMsg(msg);
        dlg.showModal();

        return new Promise<boolean>(resolve=>{
            dlg.addEventListener('close', () => {
                resolve(dlg.returnValue === 'true');
            });
        });
    };

    return <Dialog {...props} class='w-60' ref={el => dlg = el} actions={ dlg!.DefaultActions(async()=>'true')}>
        <p>{msg()}</p>
    </Dialog>;
}

/**
 * 提供了与 {@link window#confirm} 相同的功能，但是在行为上有些不同。
 * {@link window#confirm} 是阻塞模式的，而当前函数则是异步函数。
 */
export async function confirm(msg?: string): Promise<boolean> { return await confirmInst(msg); }

/************************ prompt *****************************/

let promptInst: { (msg?: string, val?: string): Promise<string | null> };

function Prompt(props: Props): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<string>();
    const access = FieldAccessor('prompt', '', false);

    promptInst = (msg?: string, val?: string): Promise<string | null> => {
        setMsg(msg);
        access.setValue(val ?? '');
        dlg.showModal();

        return new Promise<string | null>(resolve => {
            dlg.addEventListener('close', () => {
                resolve(dlg.returnValue ?? null);
                access.setValue('');
            });
        });
    };

    return <Dialog {...props} ref={el => dlg = el} class='w-60' actions={ dlg!.DefaultActions(async()=>access.getValue())}>
        <TextField label={msg()} accessor={access} />
    </Dialog>;
}

/**
 * 提供了与 {@link window#prompt} 相同的功能，但是在行为上有些不同。
 * {@link window#prompt} 是阻塞模式的，而当前函数则是异步函数。
 */
export async function prompt(msg?: string, val?: string): Promise<string | null> { return await promptInst(msg, val); }

