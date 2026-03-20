// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { Portal, render } from 'solid-js/web';

import type { MountProps } from '@components/base';
import { joinClass } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import { Message, type Props as MessageProps, type Type } from '@components/notify/message';
import styles from './style.module.css';

let notifyInst: typeof notify;
let systemInst: typeof system;

/**
 * {@link notify} 的快捷方式，用于显示成功信息。
 */
export async function success(title: string, body?: string, duration?: number, system = false): Promise<void> {
	await notify(title, body, 'success', duration, system);
}

/**
 * {@link notify} 的快捷方式，用于显示普通信息。
 */
export async function info(title: string, body?: string, duration?: number, system = false): Promise<void> {
	await notify(title, body, 'info', duration, system);
}

/**
 * {@link notify} 的快捷方式，用于显示警告信息。
 */
export async function warning(title: string, body?: string, duration?: number, system = false): Promise<void> {
	await notify(title, body, 'warning', duration, system);
}

/**
 * {@link notify} 的快捷方式，用于显示错误信息。
 */
export async function error(title: string, body?: string, duration?: number, system = false): Promise<void> {
	await notify(title, body, 'error', duration, system);
}

/**
 * 发送一条通知给用户
 *
 * @param title - 标题；
 * @param body - 具体内容，如果为空则只显示标题；
 * @param type - 类型，仅对非系统通知的情况下有效；
 * @param duration - 如果大于 0，超过此毫秒数时将自动关闭提示框；
 * @param system - 当处于后台时，是否使用系统通知。系统通知不会区分 type 类型且未必会成功；
 */
export async function notify(
	title: string,
	body?: string,
	type?: Type,
	duration?: number,
	system = false,
): Promise<void> {
	return await notifyInst(title, body, type, duration, system);
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

export type Props = ParentProps & MountProps;

/**
 * 注册全局通知组件
 *
 * 尽可能早地调用该组件，以使 {@link notify} 处于可用状态。
 *
 * NOTE: 不可多次调用，仅用于初始化通知组件。
 */
export function NotifyProvider(props: Props): JSX.Element {
	return (
		<>
			<Portal mount={props.mount}>{init()}</Portal>
			{props.children}
		</>
	);
}

function init(): JSX.Element {
	const [opt, origin] = useOptions();
	const l = useLocale();
	let ref: HTMLDivElement;

	notifyInst = async (title: string, body?: string, type?: Type, duration?: number, sys = false): Promise<void> => {
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

			// 通知可能放在 ThemeProvider 之外，所以使用 useOptions 的值。
			transitionDuration: opt.getTransitionDuration(),
			closeAriaLabel: l.t('_c.close'),
		};
		render(() => <Message {...props} />, ref);
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

	return <div ref={el => (ref = el)} class={joinClass('error', styles.notify)} />;
}
