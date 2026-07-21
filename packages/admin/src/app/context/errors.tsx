// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Result, useLocale } from '@cmfx/components';
import { APIError, NetworkError, PermissionError, RuntimeError } from '@cmfx/core';
import type * as illustrations from '@cmfx/illustrations';
import { Navigate, useLocation, useNavigate } from '@solidjs/router';
import { type Component, createSignal, type JSX, onCleanup, onMount } from 'solid-js';

import { useAdmin } from './admin';
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
			<Result palette="error" title={title} description={msg} illustration={<opt.illustrations.Bug />}>
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

	const offline = (err?: APIError): JSX.Element => {
		const text = err?.title || l.t('_p.error.noNetwork');

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
			<Result palette="error" title={text} illustration={<opt.illustrations.Offline text={text} />}>
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

	if (err instanceof RuntimeError) {
		if (err instanceof APIError) {
			switch (err.status) {
				case 401: {
					const loc = useLocation();
					if (loc.pathname !== opt.routes.public.home) {
						return <Navigate href={/*@once*/ opt.routes.public.home} />;
					}
					return Error4XX(opt.illustrations.Error401, err.title || l.t('_p.error.unauthorized'));
				}
				case 402:
					return Error4XX(opt.illustrations.Error402, err.title || l.t('_p.error.paymentRequired'));
				case 403:
					return Error4XX(opt.illustrations.Error403, err.title || l.t('_p.error.forbidden'));
				case 404:
					return NotFound(err);
				case 429:
					return Error4XX(opt.illustrations.Error429, err.title || l.t('_p.error.tooManyRequests'));
				case 500:
					return Error5XX(
						opt.illustrations.Error500,
						err.title || l.t('_p.error.internalServerError'),
						err.headers?.get('Retry-After'),
					);
				case 503:
					return Error5XX(
						opt.illustrations.Error503,
						err.title || l.t('_p.error.serverUnavailable'),
						err.headers?.get('Retry-After'),
					);
				case 504:
					return Error5XX(
						opt.illustrations.Error504,
						err.title || l.t('_p.error.gatewayTimeout'),
						err.headers?.get('Retry-After'),
					);
				default:
					return navigator.onLine ? unknown(l.t('_p.error.unknownError'), err.message) : offline(err);
			}
		} else if (err instanceof NetworkError) {
			// 其它网络错误
			return navigator.onLine ? unknown(l.t('_p.error.unknownError'), err.message) : offline();
		} else if (err instanceof PermissionError) {
			return Error4XX(opt.illustrations.Error403, l.t('_p.error.forbidden'));
		}

		return unknown(err.name, err.message);
	}

	if (err instanceof Error) {
		// TODO: 改为 Error.isError https://caniuse.com/?search=isError
		console.error(err.name, err.message, err.stack);
		return unknown(err.name, err.message);
	}

	console.error(err);
	return unknown(l.t('_p.error.unknownError'), `${err}`);
}

function Error5XX(
	illustration: Component<illustrations.Props>,
	text: string,
	retry: string | undefined | null,
): JSX.Element {
	return (
		<Result palette="error" title={text} illustration={illustration({ text })}>
			<div class={styles['error-actions']}>
				<BackHome />
				<BackPrev />
				<RefreshButton retry={retry} />
			</div>
		</Result>
	);
}

function Error4XX(illustration: Component<illustrations.Props>, text: string): JSX.Element {
	return (
		<Result palette="error" title={text} illustration={illustration({ text })}>
			<div class={styles['error-actions']}>
				<BackHome />
				<BackPrev />
			</div>
		</Result>
	);
}

/**
 * 404 错误
 */
export function NotFound(err?: Error): JSX.Element {
	const opt = useOptions();
	const l = useLocale();
	const text = err ? (err instanceof APIError ? err.title : err.name) : l.t('_p.error.pageNotFound');
	return Error4XX(opt.illustrations.Error404, text!);
}

/**
 * 返回首页的按钮
 *
 * @remarks
 * 根据是否登录的状态，返回不同的首页。
 */
function BackHome(): JSX.Element {
	const admin = useAdmin();
	const l = useLocale();
	const opt = useOptions();
	return (
		<Button palette="primary" type="a" href={admin.info()?.id ? opt.routes.private.home : opt.routes.public.home}>
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
