// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { createSignal, type JSX, Match, type ParentProps, Show, Switch, untrack } from 'solid-js';

import { Avatar } from '@components/avatar';
import type { BaseRef, RefProps } from '@components/base';
import { Button } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { useLocale, useOptions } from '@components/context';
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

export interface LockScreenProps extends ParentProps, ThemeProps, RefProps<LockScreenRef> {
	/**
	 * 退出按钮上的操作
	 *
	 * @remarks
	 * 当用户忘记锁屏密码时，可调用此方法执行退出操作。
	 */
	readonly logout: () => Promise<void>;

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

const lockScreenID = 'lock-screen';

/**
 * 锁屏组件
 *
 * @remarks
 * 这是个防君子不防小人的组件，仅是在最上层添加了一个遮罩层，用于防止用户在锁屏状态下进行操作。
 */
export function LockScreen(props: LockScreenProps): JSX.Element {
	const [, opt] = useOptions();
	const [locked, setLocked] = createSignal(opt.config.get<boolean>(lockScreenID));
	const [password, setPassword] = createSignal<string>();
	const l = useLocale();

	const setLck = (v: boolean) => {
		setLocked(v);
		opt.config.set(lockScreenID, v);
	};

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
					lock: () => setLck(true),
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

							<Button class={styles.item} onclick={() => setLck(false)}>
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
									setLck(false);
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

							<Button class={styles.item} kind="border" onclick={async () => await props.logout()}>
								{l.t('_c.lockScreen.logout')}
							</Button>

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
