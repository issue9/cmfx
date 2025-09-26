// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, ParentProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { BaseProps } from '@/base';
import { fieldAccessor, TextField } from '@/form';
import { Dialog, Ref } from './dialog';

export interface Props extends BaseProps, ParentProps {
    /**
     * 是否同时替换系统对话框
     */
    system?: boolean;

    /**
     * 系统弹出框的标题
     */
    header?: string;
}

interface DialogProps extends BaseProps { header?: string; }

/**
 * 提供了 {@link alert}、{@link confirm} 和 {@link prompt} 的方法，可用于替换对应的浏览器方法。
 */
export default function SystemDialog(props: Props): JSX.Element {
    if (props.system) {
        window.alert = alert;
        window.confirm = confirm as any;
        window.prompt = prompt as any;
    }

    return <>
        <Portal>
            <Alert header={props.header} palette={props.palette} />
            <Confirm header={props.header} palette={props.palette} />
            <Prompt header={props.header} palette={props.palette} />
        </Portal>
        {props.children}
    </>;
}

/************************ alert *****************************/

let alertInst: typeof alert;

function Alert(props: DialogProps): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<any>();
    const [title, setTitle] = createSignal(props.header);

    alertInst = async (msg?: any, title?: string): Promise<void> => {
        setMsg(msg);
        if (title) { setTitle(title); }
        dlg.element().showModal();

        return new Promise<void>(resolve => {
            dlg.element().addEventListener('close', () => resolve());
        });
    };

    return <Dialog movable palette={props.palette} header={title()} ref={el => dlg = el} class='min-w-60' actions={
        dlg!.OKAction(async () => { return 'ok'; })
    }>{msg()}</Dialog>;
}

/**
 * 提供了与 {@link window#alert} 相同的功能，但是在行为上有些不同。
 * {@link window#alert} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 提示框的内容；
 * @param title - 提示框的标题，如果为空则采用 {@link SystemDialog} 的 {@link Props#header} 作为默认值；
 */
export async function alert(msg: any, title?: string): Promise<void> {
    await alertInst(msg, title);
}

/************************ confirm *****************************/

let confirmInst: typeof confirm;

function Confirm(props: DialogProps): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<string>();
    const [title, setTitle] = createSignal(props.header);

    confirmInst = (msg?: string, title?: string): Promise<boolean> => {
        setMsg(msg);
        if (title) { setTitle(title); }
        dlg.element().showModal();

        return new Promise<boolean>(resolve=>{
            dlg.element().addEventListener('close', () => {
                resolve(dlg.element().returnValue === 'true');
            });
        });
    };

    return <Dialog movable palette={props.palette} header={title()} class='m-w-60' ref={el => dlg = el}
        actions={dlg!.DefaultActions(async () => 'true')}>
        <p>{msg()}</p>
    </Dialog>;
}

/**
 * 提供了与 {@link window#confirm} 相同的功能，但是在行为上有些不同。
 * {@link window#confirm} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 提示框的内容；
 * @param title - 提示框的标题，如果为空则采用 {@link SystemDialog} 的 {@link Props#header} 作为默认值；
 */
export async function confirm(msg?: string, title?: string): Promise<boolean> {
    return await confirmInst(msg, title);
}

/************************ prompt *****************************/

let promptInst: typeof prompt;

function Prompt(props: DialogProps): JSX.Element {
    let dlg: Ref;
    const [msg, setMsg] = createSignal<string>();
    const [title, setTitle] = createSignal(props.header);
    const access = fieldAccessor('prompt', '');

    promptInst = (msg?: string, val?: string, title?: string): Promise<string | null> => {
        setMsg(msg);
        if (title) { setTitle(title); }
        access.setValue(val ?? '');
        dlg.element().showModal();

        return new Promise<string | null>(resolve => {
            dlg.element().addEventListener('close', () => {
                resolve(dlg.element().returnValue ?? null);
                access.setValue('');
            });
        });
    };

    return <Dialog movable palette={props.palette} header={title()} ref={el => dlg = el} class='min-w-60'
        actions={dlg!.DefaultActions(async () => access.getValue())}>
        <TextField class='w-full' layout='vertical' label={msg()} accessor={access} />
    </Dialog>;
}

/**
 * 提供了与 {@link window#prompt} 相同的功能，但是在行为上有些不同。
 * {@link window#prompt} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 对话框的内容；
 * @param val - 对话框中的默认值；
 * @param title - 对话框的标题，如果为空则采用 {@link SystemDialog} 的 {@link Props#header} 作为默认值；
 */
export async function prompt(msg?: string, val?: string, title?: string): Promise<string | null> {
    return await promptInst(msg, val, title);
}
