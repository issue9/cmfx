// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { getOwner, type JSX, type ParentProps, runWithOwner } from 'solid-js';
import { Portal, render } from 'solid-js/web';

import type { MountProps } from '@components/base';
import { joinClass } from '@components/base';
import { useOptions } from '@components/context';
import { Message, type Props as MessageProps, type Type } from '@components/notify/message';
import styles from './style.module.css';

let notifyInst: typeof notify;
let systemInst: typeof system;

export const positions = ['top', 'bottom'] as const;

export type Position = (typeof positions)[number];

/**
 * {@link notify} 的快捷方式，用于显示成功信息。
 */
export async function success(
	title: string,
	body?: string,
	duration?: number,
	system = false,
	pos: Position = 'top',
): Promise<void> {
	await notify(title, body, 'success', duration, system, pos);
}

/**
 * {@link notify} 的快捷方式，用于显示普通信息。
 */
export async function info(
	title: string,
	body?: string,
	duration?: number,
	system = false,
	pos: Position = 'top',
): Promise<void> {
	await notify(title, body, 'info', duration, system, pos);
}

/**
 * {@link notify} 的快捷方式，用于显示警告信息。
 */
export async function warning(
	title: string,
	body?: string,
	duration?: number,
	system = false,
	pos: Position = 'top',
): Promise<void> {
	await notify(title, body, 'warning', duration, system, pos);
}

/**
 * {@link notify} 的快捷方式，用于显示错误信息。
 */
export async function error(
	title: string,
	body?: string,
	duration?: number,
	system = false,
	pos: Position = 'top',
): Promise<void> {
	await notify(title, body, 'error', duration, system, pos);
}

/**
 * 发送一条通知给用户
 *
 * @param title - 标题；
 * @param body - 具体内容，如果为空则只显示标题；
 * @param type - 类型，仅对非系统通知的情况下有效；
 * @param duration - 如果大于 0，超过此毫秒数时将自动关闭提示框；
 * @param system - 当处于后台时，是否使用系统通知。系统通知不会区分 type 类型且未必会成功；
 * @param pos - 弹出位置；
 */
export async function notify(
	title: string,
	body?: string,
	type?: Type,
	duration?: number,
	system = false,
	pos: Position = 'top',
): Promise<void> {
	return await notifyInst(title, body, type, duration, system, pos);
}

/**
 * 向操作系统的通知中心发送消息
 *
 * @param title - 标题；
 * @param o - 其他选项，并不是所有选项都被系统支持，具体情况可参考 https://caniuse.com/?search=Notification；
 *
 * @remarks
 * 发送系统通知并不是总能成功的，因为浏览器可能会阻止系统通知的显示。
 */
export async function system(title: string, o?: NotificationOptions): Promise<Notification | undefined> {
	return await systemInst(title, o);
}

/**
 * 注册全局通知组件
 *
 * 尽可能早地调用该组件，以使 {@link notify} 处于可用状态。
 *
 * NOTE: 不可多次调用，仅用于初始化通知组件。
 */
export function NotifyProvider(props: ParentProps & MountProps): JSX.Element {
	return (
		<>
			<Portal mount={props.mount}>{init()}</Portal>
			{props.children}
		</>
	);
}

function init(): JSX.Element {
	const [opt, origin] = useOptions();
	let topRef: HTMLDivElement;
	let bottomRef: HTMLDivElement;
	const owner = getOwner();

	notifyInst = async (
		title: string,
		body?: string,
		type?: Type,
		duration?: number,
		sys = false,
		pos: Position = 'top',
	): Promise<void> => {
		if (sys && document.visibilityState === 'hidden') {
			const n = await system(title, { body: body });

			if (duration && n) {
				await sleep(duration);
				n.close();
			}
			return;
		}

		const props: MessageProps = {
			title,
			body,
			type,
			duration: duration ?? opt.getStays(),
			closable: true,
		};

		switch (pos) {
			case 'top':
				runWithOwner(owner, () => render(() => <Message {...props} />, topRef));
				break;
			case 'bottom':
				runWithOwner(owner, () => render(() => <Message {...props} />, bottomRef));
		}
	};

	systemInst = async (title: string, o?: NotificationOptions): Promise<Notification | undefined> => {
		if (!('Notification' in window)) {
			// 不支持
			return;
		} else if (Notification.permission === 'denied') {
			// 明确拒绝
			return;
		} else if (Notification.permission !== 'granted') {
			// 未明确的权限
			if ((await Notification.requestPermission()) === 'denied') {
				return;
			}
		}

		o = Object.assign(
			{},
			{
				badge: origin.logo,
				icon: origin.logo,
				lang: opt.getLocale(), // 使用的是全局的配置
			},
			o,
		);

		try {
			return new Notification(title, o);
		} catch (e) {
			console.error(e);
			return;
		}
	};

	return (
		<>
			<div ref={el => (topRef = el)} class={joinClass('error', styles.notify, styles.top)} />
			<div ref={el => (bottomRef = el)} class={joinClass('error', styles.notify, styles.bottom)} />
		</>
	);
}
