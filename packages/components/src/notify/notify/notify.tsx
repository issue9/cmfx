// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { joinClass } from '@cmfx/themes';
import { getOwner, type JSX, type ParentProps, runWithOwner } from 'solid-js';
import { Portal, render } from 'solid-js/web';

import type { MountProps } from '@components/base';
import { useOptions } from '@components/context';
import { type NotifyPosition, notifyPositions } from '@components/context/options/options';
import { Message, type MessageProps, type MessageType } from '@components/notify/message';
import styles from './style.module.css';

let notifyInst: typeof notify;
let systemInst: typeof system;

export { type NotifyPosition, notifyPositions };

export interface NotifyOptions {
	/**
	 * 具体内容，如果为空则只显示标题
	 */
	body?: string;

	/**
	 * 类型，仅对非系统通知的情况下有效
	 */
	type?: MessageType;

	/**
	 * 如果大于 0，超过此毫秒数时将自动关闭提示框
	 */
	duration?: number;

	/**
	 * 当处于后台时，是否使用系统通知。系统通知不会区分 type 类型且未必会成功
	 */
	system?: boolean;

	/**
	 * 弹出位置
	 */
	pos?: NotifyPosition;

	/**
	 * 点击确认按钮时触发的回调
	 *
	 * @remarks
	 * 只有指定该值，才会显示确定按钮。该操作会关闭整个消息框，但是返回 true 可以取消关闭通知框。
	 */
	accept?: MessageProps['onAccept'];

	/**
	 * 点击取消按钮时触发的回调
	 *
	 * @remarks
	 * 只有指定该值，才会显示取消按钮。该操作会关闭整个消息框，但是返回 true 可以取消关闭通知框。
	 */
	cancel?: MessageProps['onCancel'];
}

/**
 * {@link notify} 的快捷方式，用于显示成功信息。
 */
export async function success(title: string, o?: Omit<NotifyOptions, 'type'>): Promise<void> {
	await notify(title, o ? { ...o, type: 'success' } : { type: 'success' });
}

/**
 * {@link notify} 的快捷方式，用于显示普通信息。
 */
export async function info(title: string, o?: Omit<NotifyOptions, 'type'>): Promise<void> {
	await notify(title, o ? { ...o, type: 'info' } : { type: 'info' });
}

/**
 * {@link notify} 的快捷方式，用于显示警告信息。
 */
export async function warning(title: string, o?: Omit<NotifyOptions, 'type'>): Promise<void> {
	await notify(title, o ? { ...o, type: 'warning' } : { type: 'warning' });
}

/**
 * {@link notify} 的快捷方式，用于显示错误信息。
 */
export async function error(title: string, o?: Omit<NotifyOptions, 'type'>): Promise<void> {
	await notify(title, o ? { ...o, type: 'error' } : { type: 'error' });
}

/**
 * 发送一条通知给用户
 *
 * @param title - 通知标题；
 * @param o - 其他选项；
 */
export async function notify(title: string, o?: NotifyOptions): Promise<void> {
	await notifyInst(title, o);
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

	notifyInst = async (title: string, o?: NotifyOptions): Promise<void> => {
		if (o?.system && document.visibilityState === 'hidden') {
			const n = await system(title, { body: o?.body });

			if (o?.duration && n) {
				await sleep(o.duration);
				n.close();
			}
			return;
		}

		const props: MessageProps = {
			title: title,
			body: o?.body,
			type: o?.type,
			duration: o?.duration ?? opt.getStays(),
			onAccept: o?.accept,
			onCancel: o?.cancel,
		};

		const pos = o?.pos ?? opt.getNotifyPosition();
		switch (pos) {
			case 'top':
				runWithOwner(owner, () => render(() => <Message {...props} />, topRef));
				break;
			case 'bottom':
				runWithOwner(owner, () => render(() => <Message {...props} />, bottomRef));
		}
	};

	systemInst = async (title: string, o?: NotificationOptions): Promise<Notification | undefined> => {
		if (!('Notification' in window) || Notification.permission === 'denied') {
			return;
		} else if (Notification.permission !== 'granted') {
			// 未明确的权限
			if ((await Notification.requestPermission()) === 'denied') {
				return;
			}
		}

		try {
			return new Notification(
				title,
				Object.assign(
					{},
					{
						badge: origin.logo,
						icon: origin.logo,
						lang: opt.getLocale(), // 使用的是全局的配置
					},
					o,
				),
			);
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
