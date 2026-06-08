// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, type ParentProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import type { BaseProps, MountProps } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import { Form } from '@components/form';
import { InputText } from '@components/input';
import { AcceptButton, Actions } from './buttons';
import type { Ref } from './context';
import { Root } from './root';
import styles from './style.module.css';
import { Toolbar } from './toolbar';

export type Props = BaseProps & ParentProps & MountProps;

const acceptValue = 'accept';

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
	const [, opt] = useOptions();

	alertInst = async (msg?: string): Promise<void> => {
		setMsg(msg);
		dlg.root().showModal();

		return new Promise<void>(resolve => {
			const close = () => {
				resolve();
				dlg.root().removeEventListener('close', close);
			};

			dlg.root().addEventListener('close', close);
		});
	};

	return (
		<Root
			palette={props.palette}
			header={
				<Toolbar movable close>
					{opt.title}
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
	const [, opt] = useOptions();

	confirmInst = (msg?: string): Promise<boolean> => {
		setMsg(msg);
		dlg.root().showModal();

		return new Promise<boolean>(resolve => {
			const close = () => {
				resolve(dlg.root().returnValue === acceptValue);
				dlg.root().removeEventListener('close', close);
			};

			dlg.root().addEventListener('close', close);
		});
	};

	return (
		<Root
			palette={props.palette}
			header={
				<Toolbar movable close>
					{opt.title}
				</Toolbar>
			}
			class="min-w-60"
			ref={el => (dlg = el)}
			footer={<Actions acceptValue={acceptValue} />}
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
	let dlg: Ref;
	const [msg, setMsg] = createSignal<string>();
	const [value, setValue] = createSignal('');
	const [, opt] = useOptions();

	promptInst = (msg?: string, val?: string): Promise<string | null> => {
		setMsg(msg);
		setValue(val ?? '');
		dlg.root().showModal();

		return new Promise<string | null>(resolve => {
			const close = () => {
				if (dlg.root().returnValue === acceptValue) {
					const v = value();
					resolve(v);
				}
				setValue('');
				dlg.root().removeEventListener('close', close);
			};

			dlg.root().addEventListener('close', close);
		});
	};

	return (
		<Root
			palette={props.palette}
			header={
				<Toolbar movable close>
					{opt.title}
				</Toolbar>
			}
			ref={el => (dlg = el)}
			class="min-w-60"
			footer={<Actions acceptValue={acceptValue} />}
		>
			<Form.Field layout="vertical" label={msg()} class="w-full">
				<InputText.Root value={value()} onChange={setValue} />
			</Form.Field>
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
