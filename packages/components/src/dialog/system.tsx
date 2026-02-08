// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, ParentProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { BaseProps, MountProps } from '@components/base';
import { useOptions } from '@components/context';
import { fieldAccessor, TextField } from '@components/form';
import { Dialog, Ref } from './dialog';

export type Props = BaseProps & ParentProps & MountProps;

/**
 * 提供了 {@link xalert}、{@link xconfirm} 和 {@link xprompt} 的方法，可用于替换对应的浏览器方法。
 */
export default function SystemDialog(props: Props): JSX.Element {
	return (
		<>
			<Portal mount={props.mount}>
				<Alert palette={props.palette} />
				<Confirm palette={props.palette} />
				<Prompt palette={props.palette} />
			</Portal>
			{props.children}
		</>
	);
}

/************************ alert *****************************/

let alertInst: typeof xalert;

function Alert(props: BaseProps): JSX.Element {
	const [, org] = useOptions();
	const [msg, setMsg] = createSignal<string>();
	let dlg: Ref;

	alertInst = async (msg?: string): Promise<void> => {
		setMsg(msg);
		dlg.root().showModal();

		return new Promise<void>(resolve => {
			dlg.root().addEventListener('close', () => resolve());
		});
	};

	return (
		<Dialog
			movable
			palette={props.palette}
			header={org.title}
			ref={el => {
				dlg = el;
			}}
			class="min-w-60"
			actions={dlg!.OKAction(async () => {
				return 'ok';
			})}
		>
			{msg()}
		</Dialog>
	);
}

/**
 * 提供了与 {@link window#alert} 相同的功能，但是在行为上有些不同。
 * {@link window#alert} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 提示框的内容；
 */
export async function xalert(msg: string): Promise<void> {
	await alertInst(msg);
}

/************************ confirm *****************************/

let confirmInst: typeof xconfirm;

function Confirm(props: BaseProps): JSX.Element {
	const [, org] = useOptions();
	const [msg, setMsg] = createSignal<string>();
	let dlg: Ref;

	confirmInst = (msg?: string): Promise<boolean> => {
		setMsg(msg);
		dlg.root().showModal();

		return new Promise<boolean>(resolve => {
			dlg.root().addEventListener('close', () => {
				resolve(dlg.root().returnValue === 'true');
			});
		});
	};

	return (
		<Dialog
			movable
			palette={props.palette}
			header={org.title}
			class="min-w-60"
			ref={el => {
				dlg = el;
			}}
			actions={dlg!.DefaultActions(async () => 'true')}
		>
			<p>{msg()}</p>
		</Dialog>
	);
}

/**
 * 提供了与 {@link window#confirm} 相同的功能，但是在行为上有些不同。
 * {@link window#confirm} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 提示框的内容；
 */
export async function xconfirm(msg?: string): Promise<boolean> {
	return await confirmInst(msg);
}

/************************ prompt *****************************/

let promptInst: typeof xprompt;

function Prompt(props: BaseProps): JSX.Element {
	const [, org] = useOptions();
	const [msg, setMsg] = createSignal<string>();
	let dlg: Ref;
	const access = fieldAccessor('prompt', '');

	promptInst = (msg?: string, val?: string): Promise<string | null> => {
		setMsg(msg);
		access.setValue(val ?? '');
		dlg.root().showModal();

		return new Promise<string | null>(resolve => {
			dlg.root().addEventListener('close', () => {
				resolve(dlg.root().returnValue ?? null);
				access.setValue('');
			});
		});
	};

	return (
		<Dialog
			movable
			palette={props.palette}
			header={org.title}
			ref={el => {
				dlg = el;
			}}
			class="min-w-60"
			actions={dlg!.DefaultActions(async () => access.getValue())}
		>
			<TextField class="w-full" layout="vertical" label={msg()} accessor={access} />
		</Dialog>
	);
}

/**
 * 提供了与 {@link window#prompt} 相同的功能，但是在行为上有些不同。
 * {@link window#prompt} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 对话框的内容；
 * @param val - 对话框中的默认值；
 */
export async function xprompt(msg?: string, val?: string): Promise<string | null> {
	return await promptInst(msg, val);
}
