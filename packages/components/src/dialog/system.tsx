// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, type ParentProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import type { BaseProps, MountProps } from '@components/base';
import { useLocale } from '@components/context';
import { Form, TextField } from '@components/form';
import { AcceptButton, Actions } from './buttons';
import type { Ref } from './context';
import { Root } from './root';
import styles from './style.module.css';
import { Toolbar } from './toolbar';

export type Props = BaseProps & ParentProps & MountProps;

/**
 * 提供了 {@link alert}、{@link confirm} 和 {@link prompt} 的方法，可用于替换对应的浏览器方法。
 */
export function DialogProvider(props: Props): JSX.Element {
	return (
		<>
			<Portal mount={props.mount}>
				<AlertProvider palette={props.palette} />
				<ConfirmProvider palette={props.palette} />
				<PromptProvider palette={props.palette} />
			</Portal>
			{props.children}
		</>
	);
}

/************************ alert *****************************/

let alertInst: typeof alert;

function AlertProvider(props: BaseProps): JSX.Element {
	const [msg, setMsg] = createSignal<string>();
	let dlg: Ref;
	const l = useLocale();

	alertInst = async (msg?: string): Promise<void> => {
		setMsg(msg);
		dlg.root().showModal();

		return new Promise<void>(resolve => {
			dlg.root().addEventListener('close', () => resolve());
		});
	};

	return (
		<Root
			palette={props.palette}
			header={
				<Toolbar movable close>
					{l.t('_c.color.pickColor')}
				</Toolbar>
			}
			ref={el => (dlg = el)}
			class="min-w-60"
			footer={
				<footer class={styles.footer}>
					<AcceptButton value="ok">{l.t('_c.ok')}</AcceptButton>
				</footer>
			}
		>
			{msg()}
		</Root>
	);
}

/**
 * 提供了与 {@link window#alert} 相同的功能，但是在行为上有些不同。
 * {@link window#alert} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 提示框的内容；
 */
export async function alert(msg: string): Promise<void> {
	await alertInst(msg);
}

/************************ confirm *****************************/

let confirmInst: typeof confirm;

function ConfirmProvider(props: BaseProps): JSX.Element {
	const [msg, setMsg] = createSignal<string>();
	let dlg: Ref;
	const l = useLocale();

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
		<Root
			palette={props.palette}
			header={
				<Toolbar movable close>
					{l.t('_c.color.pickColor')}
				</Toolbar>
			}
			class="min-w-60"
			ref={el => (dlg = el)}
			footer={<Actions />}
		>
			<p>{msg()}</p>
		</Root>
	);
}

/**
 * 提供了与 {@link window#confirm} 相同的功能，但是在行为上有些不同。
 * {@link window#confirm} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 提示框的内容；
 */
export async function confirm(msg?: string): Promise<boolean> {
	return await confirmInst(msg);
}

/************************ prompt *****************************/

let promptInst: typeof prompt;

function PromptProvider(props: BaseProps): JSX.Element {
	const [msg, setMsg] = createSignal<string>();
	let dlg: Ref;
	const access = Form.fieldAccessor('prompt', '');
	const l = useLocale();

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
		<Root
			palette={props.palette}
			header={
				<Toolbar movable close>
					{l.t('_c.color.pickColor')}
				</Toolbar>
			}
			ref={el => (dlg = el)}
			class="min-w-60"
			footer={<Actions />}
		>
			<TextField.Root class="w-full" layout="vertical" label={msg()} accessor={access} />
		</Root>
	);
}

/**
 * 提供了与 {@link window#prompt} 相同的功能，但是在行为上有些不同。
 * {@link window#prompt} 是阻塞模式的，而当前函数则是异步函数。
 *
 * @param msg - 对话框的内容；
 * @param val - 对话框中的默认值；
 */
export async function prompt(msg?: string, val?: string): Promise<string | null> {
	return await promptInst(msg, val);
}
