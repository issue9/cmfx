// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BaseProps } from '@cmfx/components';
import { createSignal, type JSX, Match, type ParentProps, Show, Switch, untrack } from 'solid-js';

import { Avatar } from '@components/avatar';
import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { useLocale } from '@components/context';
import { Form } from '@components/form';
import { InputPassword } from '@components/input';
import { Spin } from '@components/spin';
import styles from './style.module.css';

export interface LockScreenRef extends BaseRef<HTMLDivElement> {
	/**
	 * 执行锁屏操作
	 */
	lock(): void;
}

export interface LockScreenProps extends ParentProps, BaseProps, RefProps<LockScreenRef> {
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
 * 锁屏组件
 *
 * @remarks
 * 这是个防君子不防小人的组件，仅是在最上层添加了一个遮罩层，用于防止用户在锁屏状态下进行操作。
 */
export function LockScreen(props: LockScreenProps): JSX.Element {
	const [locked, setLocked] = createSignal(false);
	const [password, setPassword] = createSignal<string>();
	const l = useLocale();

	const [pass, setPass] = createSignal<string>();
	const vertify = Form.createFakeField<string>('');

	let wakeRequest: WakeLockSentinel | undefined;
	const wakeRequestChange = async (v?: boolean) => {
		if (!v) {
			if (wakeRequest) {
				wakeRequest.release();
				wakeRequest = undefined;
			}
			return;
		}

		if (wakeRequest) {
			return;
		}
		wakeRequest = await navigator.wakeLock.request('screen');
	};

	return (
		<Spin
			ref={el =>
				props.ref?.({
					root: () => el.root(),
					lock: () => setLocked(true),
				})
			}
			style={props.style}
			class={props.class}
			palette={props.palette}
			spinning={locked()}
			overlayClass={styles.screen}
			indicator={
				<Switch>
					<Match when={!password()}>
						<form class={styles.password} onSubmit={() => setPassword(untrack(pass))}>
							<Show when={props.avatar}>{c => <Avatar rounded value={c()} />}</Show>
							<Show when={props.name}>{c => <p>{c()}</p>}</Show>

							<InputPassword placeholder={l.t('_c.lockScreen.enterPassword')} class={styles.item} onChange={setPass} />

							<Button palette="primary" disabled={!pass()} class={styles.item} type="submit">
								{l.t('_c.lockScreen.lock')}
							</Button>

							<Button class={styles.item} onclick={() => setLocked(false)}>
								{l.t('_c.lockScreen.cancel')}
							</Button>
						</form>
					</Match>

					<Match when={password()}>
						<form
							class={styles.password}
							onsubmit={() => {
								if (vertify.getValue() === password()) {
									setPassword();
									setLocked(false);
								} else {
									vertify.setError(l.t('_c.lockScreen.invalidPassword'));
								}
							}}
						>
							<Show when={props.avatar}>{c => <Avatar rounded value={c()} />}</Show>

							<Show when={props.name}>{c => <p>{c()}</p>}</Show>

							<div class={joinClass(undefined, styles.item, styles.input)}>
								<InputPassword
									autocomplete="off"
									placeholder={l?.t('_c.lockScreen.enterPassword')}
									class="w-full"
									onChange={v => vertify.setValue(v)}
								/>
								<p class={styles.error}>{vertify.getError()}</p>
							</div>

							<Button class={styles.item} palette="primary" disabled={!vertify.getValue()} type="submit">
								{l.t('_c.lockScreen.unlock')}
							</Button>

							<Show when={props.logout}>
								{c => (
									<Button class={styles.item} kind="border" onclick={async () => await c()()}>
										{l.t('_c.lockScreen.logout')}
									</Button>
								)}
							</Show>

							{/** biome-ignore lint/a11y/noLabelWithoutControl: Checkbox 是对 input 的封装 */}
							<label class={joinClass(undefined, styles.item, styles.label)}>
								<Checkbox onChange={wakeRequestChange} />
								{l.t('_c.lockScreen.preventScreenLock')}
							</label>
						</form>
					</Match>
				</Switch>
			}
		>
			{props.children}
		</Spin>
	);
}
