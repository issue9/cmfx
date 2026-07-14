// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Result, useLocale } from '@cmfx/components';
import { APIError } from '@cmfx/core';
import { amico } from '@cmfx/illustrations';
import { Navigate, useLocation, useNavigate } from '@solidjs/router';
import { createMemo, createSignal, type JSX, onCleanup, onMount } from 'solid-js';

import { useOptions } from './options';
import styles from './style.module.css';

/**
 * 错误处理方法
 *
 * @param err - 错误信息，如果是 {@link APIError}，则会显示专门的插画页面；
 * @param reset - 重置方法；
 * @remarks
 * 这是 {@link ErrorBoundary} 的 fallback 类型。
 */
export function errorHandler(err: unknown, reset: () => void): JSX.Element {
	// NOTE: APIError 错误，需要重新刷新整个页面才有效果，而其它错误，可能仅仅是 UI 问题，使用 reset 就可以了。

	const opt = useOptions();
	const l = useLocale();

	// 未知错误
	const unknown = (title: string, msg?: string) => {
		return (
			<Result palette="error" title={title} description={msg} illustration={<amico.BUG />}>
				<div class={styles['error-actions']}>
					<BackHome />
					<BackPrev />
					<Button palette="primary" onclick={reset}>
						{l.t('_c.reset')}
					</Button>
				</div>
			</Result>
		);
	};

	const offline = (): JSX.Element => {
		const text = l.t('_p.error.noNetwork');

		const [disabled, setDisabled] = createSignal(true);
		const setDisabledTrue = () => setDisabled(true);
		const setDisabledFalse = () => setDisabled(false);
		onMount(() => {
			window.addEventListener('online', setDisabledFalse);
			window.addEventListener('offline', setDisabledTrue);
		});
		onCleanup(() => {
			window.removeEventListener('online', setDisabledFalse);
			window.removeEventListener('offline', setDisabledTrue);
		});

		return (
			<Result palette="error" title={text} illustration={<amico.Offline text={text} />}>
				<div class={styles['error-actions']}>
					<BackHome />
					<BackPrev />
					<Button palette="primary" disabled={disabled()} onclick={() => window.location.reload()}>
						{l.t('_c.refresh')}
					</Button>
				</div>
			</Result>
		);
	};

	if (err instanceof APIError) {
		let text: string;
		switch (err.status) {
			case 400:
				text = err.title || l.t('_p.error.badRequest');
				return (
					<Result palette="error" title={text} illustration={<amico.Error400 text={text} />}>
						<div class={styles['error-actions']}>
							<BackPrev />
							<RefreshButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 401: {
				const loc = useLocation();
				if (loc.pathname !== opt.routes.public.home) {
					return <Navigate href={/*@once*/ opt.routes.public.home} />;
				}

				text = err.title || l.t('_p.error.unauthorized');
				return (
					<Result palette="error" title={text} illustration={<amico.Error401 text={text} />}>
						<div class={styles['error-actions']}>
							<BackPrev />
							<RefreshButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			}
			case 403:
				text = err.title || l.t('_p.error.forbidden');
				return (
					<Result palette="error" title={text} illustration={<amico.Error403 text={text} />}>
						<div class={styles['error-actions']}>
							<BackHome />
							<BackPrev />
							<RefreshButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 404:
				return NotFound(err);
			case 429:
				text = err.title || l.t('_p.error.tooManyRequests');
				return (
					<Result palette="error" title={text} illustration={<amico.Error429 text={text} />}>
						<div class={styles['error-actions']}>
							<BackPrev />
							<RefreshButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 500:
				text = err.title || l.t('_p.error.internalServerError');
				return (
					<Result palette="error" title={text} illustration={<amico.Error500 text={text} />}>
						<div class={styles['error-actions']}>
							<BackHome />
							<BackPrev />
							<RefreshButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 503:
				text = err.title || l.t('_p.error.serverUnavailable');
				return (
					<Result palette="error" title={text} illustration={<amico.Error503 text={err.title} />}>
						<div class={styles['error-actions']}>
							<BackHome />
							<BackPrev />
							<RefreshButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 504:
				text = err.title || l.t('_p.error.gatewayTimeout');
				return (
					<Result palette="error" title={text} illustration={<amico.Error504 text={text} />}>
						<div class={styles['error-actions']}>
							<BackHome />
							<BackPrev />
							<RefreshButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			default:
				return navigator.onLine ? unknown(l.t('_p.error.unknownError'), err.message) : offline();
		}
	} else if (err instanceof Error) {
		// TODO: 改为 Error.isError https://caniuse.com/?search=isError
		console.error(err.name, err.message, err.stack);
		return unknown(err.name, err.message);
	}

	console.error(err);
	return unknown(l.t('_p.error.unknownError'), `${err}`);
}

/**
 * 404 错误
 */
export function NotFound(err?: Error): JSX.Element {
	const l = useLocale();

	const text = createMemo(() => {
		if (!err) {
			return l.t('_p.error.pageNotFound');
		}
		if (err instanceof APIError) {
			return err.title;
		}
		return err.name;
	});

	return (
		<Result palette="error" title={text()} illustration={<amico.Error404 text={text()} />}>
			<div class={styles['error-actions']}>
				<BackHome />
				<BackPrev />
			</div>
		</Result>
	);
}

function BackHome(): JSX.Element {
	const l = useLocale();
	const opt = useOptions();
	return (
		<Button palette="primary" type="a" href={opt.routes.private.home}>
			{l.t('_p.error.backHome')}
		</Button>
	);
}

function BackPrev(): JSX.Element {
	const l = useLocale();
	const nav = useNavigate();
	return (
		<Button palette="primary" onclick={() => nav(-1)}>
			{l.t('_p.error.backPrev')}
		</Button>
	);
}

/**
 * 刷新按钮
 *
 * @remarks
 * 如果存在 Retry-After 头部信息显示重试按钮
 */
function RefreshButton(props: { retry?: string | null }): JSX.Element {
	const l = useLocale();

	if (!props.retry) {
		return (
			<Button palette="primary" onclick={() => window.location.reload()}>
				{l.t('_c.refresh')}
			</Button>
		);
	}

	const retryN = Number(props.retry);
	const retry = !Number.isNaN(retryN) ? retryN / 1000 : (new Date(props.retry).getTime() - Date.now()) / 1000;

	const [time, setTime] = createSignal(retry);
	const timer = setInterval(() => {
		setTime(time() - 1);
		if (time() <= 0) {
			clearInterval(timer);
		}
	}, 1000);

	return (
		<Button palette="primary" onclick={() => window.location.reload()} disabled={time() <= 0}>
			{l.t('_c.refresh')} ({time()})
		</Button>
	);
}
