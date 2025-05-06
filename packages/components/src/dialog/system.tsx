// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX } from 'solid-js';

import { BaseProps } from '@/base';
import { FieldAccessor, TextField } from '@/form';
import { Dialog, Ref } from './dialog';

interface Props extends BaseProps {
    /**
     * 系统弹出框的标题
     */
    header?: string;
}

/**
 * 初始化弹出框的基本功能
 *
 * 提供了 {@link alert}、{@link confirm} 和 {@link prompt} 的方法，可用于替换对应的浏览器方法。
 *
 * NOTE: 这也是一个组件，如果想以函数的形式调用，
 * 需要在 SolidJS 初始化之后调用，比如在 HashRouter 的 Root 组件中。
 *
 * @param system 是否替换浏览器的默认弹出框；
 * @param title 浏览器弹出框的标题；
 */
export function initDialog(title: string, system?: boolean): JSX.Element {
    if (system) {
        window.alert = alert;
        window.confirm = confirm as any;
        window.prompt = prompt as any;
    }

    return <>
        <Alert header={/*@once*/title} palette='surface' />
        <Confirm header={/*@once*/title} palette='surface' />
        <Prompt header={/*@once*/title} palette='surface' />
    </>;
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

    return <Dialog movable {...props} ref={el => dlg = el} class='w-60' actions={
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

    return <Dialog movable {...props} class='w-60' ref={el => dlg = el} actions={ dlg!.DefaultActions(async()=>'true')}>
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

    return <Dialog movable {...props} ref={el => dlg = el} class='w-60' actions={ dlg!.DefaultActions(async()=>access.getValue())}>
        <TextField label={msg()} accessor={access} />
    </Dialog>;
}

/**
 * 提供了与 {@link window#prompt} 相同的功能，但是在行为上有些不同。
 * {@link window#prompt} 是阻塞模式的，而当前函数则是异步函数。
 */
export async function prompt(msg?: string, val?: string): Promise<string | null> { return await promptInst(msg, val); }
