// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Locale } from '@cmfx/core';
import { type Component, type JSX, Show } from 'solid-js';

import { Avatar } from '@components/avatar';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { InputPassword } from '@components/input';
import { useLockScreen } from './context';
import styles from './style.module.css';

export interface LockScreenScreenProps {
	/**
	 * 退出按钮上的操作
	 */
	readonly logout?: () => Promise<boolean>;

	/**
	 * 头像
	 *
	 * @reactive
	 */
	avatar?: string;

	/**
	 * 用户名
	 *
	 * @reactive
	 */
	name?: string;
}

/**
 * 锁屏的操作界面
 */
export interface LockScreenAction {
	/**
	 * 设置密码的界面
	 */
	password(l?: Locale): Promise<boolean>;

	/**
	 * 锁屏后的界面
	 */
	screen: Component<LockScreenScreenProps>;
}

/**
 * 密码形式的锁屏界面
 */
export class LockScreenPassword implements LockScreenAction {
	#password: string | null;

	async password(l?: Locale): Promise<boolean> {
		this.#password = await Dialog.prompt(l?.t('_c.lockScreen.enterPassword'), '');
		return !!this.#password;
	}

	screen(props: LockScreenScreenProps): JSX.Element {
		const ctx = useLockScreen();
		const l = useLocale();
		let password: string | undefined;

		return (
			<div class={styles.password}>
				<Show when={props.avatar}>{c => <Avatar rounded value={c()} />}</Show>

				<InputPassword
					placeholder={l?.t('_c.lockScreen.enterPassword')}
					class={styles.btn}
					onChange={v => (password = v)}
				/>

				<Button
					class={styles.btn}
					palette="primary"
					onclick={() => {
						if (password === this.#password) {
							ctx.unlock();
						}
					}}
				>
					{l.t('_c.lockScreen.unlock')}
				</Button>

				<Show when={props.logout}>
					{c => (
						<Button class={styles.btn} kind="border" onclick={async () => await c()()}>
							{l.t('_c.lockScreen.logout')}
						</Button>
					)}
				</Show>
			</div>
		);
	}
}
