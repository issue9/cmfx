// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Result, useLocale } from '@cmfx/components';
import { APIError } from '@cmfx/core';
import * as illustrations from '@cmfx/illustrations';
import { Navigate, useLocation, useNavigate } from '@solidjs/router';
import { createMemo, createSignal, JSX } from 'solid-js';

import { useOptions } from './options';
import styles from './style.module.css';

/**
 * 404 错误
 */
export function NotFound(): JSX.Element {
	const l = useLocale();
	const opt = useOptions();
	const nav = useNavigate();

	const text = createMemo(() => {
		return l.t('_p.error.pageNotFound');
	});

	return (
		<Result palette="error" title={text()} illustration={<illustrations.Error404 text={text()} />}>
			<div class={styles['error-actions']}>
				<Button palette="primary" type="a" href={opt.routes.private.home}>
					{l.t('_p.error.backHome')}
				</Button>
				<Button
					palette="primary"
					onclick={() => {
						nav(-1);
					}}
				>
					{l.t('_p.error.backPrev')}
				</Button>
			</div>
		</Result>
	);
}

/**
 * 错误处理方法
 *
 * @remarks
 * 尽可能地抛出 {@link APIError} 对象，可以显示更明确的错误页面。
 * 这是 {@link ErrorBoundary} 的 fallback 类型。
 */
export function errorHandler(err: any, reset: () => void): JSX.Element {
	// NOTE: APIError 错误，需要重新刷新整个页面才有效果，而其它错误，可能仅仅是 UI 问题，使用 reset 就可以了。

	const opt = useOptions();
	const nav = useNavigate();
	const l = useLocale();

	// 未知错误
	const unknown = (title: string, msg?: string) => {
		return (
			<Result palette="error" title={title} description={msg} illustration={<illustrations.BUG />}>
				<div class={styles['error-actions']}>
					<Button palette="primary" type="a" href={opt.routes.private.home}>
						{l.t('_p.error.backHome')}
					</Button>
					<Button
						palette="primary"
						onclick={() => {
							nav(-1);
						}}
					>
						{l.t('_p.error.backPrev')}
					</Button>
					<Button palette="primary" onclick={reset}>
						{l.t('_c.reset')}
					</Button>
				</div>
			</Result>
		);
	};

	if (err instanceof APIError) {
		console.error(err.name, err.message);

		let text: string;
		switch (err.status) {
			case 400:
				text = l.t('_p.error.badRequest');
				return (
					<Result palette="error" title={text} illustration={<illustrations.Error400 text={text} />}>
						<div class={styles['error-actions']}>
							<Button
								palette="primary"
								onclick={() => {
									nav(-1);
								}}
							>
								{l.t('_p.error.backPrev')}
							</Button>
							<RetryButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 401: {
				const loc = useLocation();
				if (loc.pathname !== opt.routes.public.home) {
					return <Navigate href={/*@once*/ opt.routes.public.home} />;
				}

				text = l.t('_p.error.unauthorized');
				return (
					<Result palette="error" title={text} illustration={<illustrations.Error401 text={text} />}>
						<div class={styles['error-actions']}>
							<Button
								palette="primary"
								onclick={() => {
									nav(-1);
								}}
							>
								{l.t('_p.error.backPrev')}
							</Button>
							<RetryButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			}
			case 403:
				text = l.t('_p.error.forbidden');
				return (
					<Result palette="error" title={text} illustration={<illustrations.Error403 text={text} />}>
						<div class={styles['error-actions']}>
							<Button palette="primary" type="a" href={opt.routes.private.home}>
								{l.t('_p.error.backHome')}
							</Button>
							<Button
								palette="primary"
								onclick={() => {
									nav(-1);
								}}
							>
								{l.t('_p.error.backPrev')}
							</Button>
							<RetryButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 404:
				return NotFound();
			case 429:
				text = l.t('_p.error.tooManyRequests');
				return (
					<Result palette="error" title={text} illustration={<illustrations.Error429 text={text} />}>
						<div class={styles['error-actions']}>
							<Button
								palette="primary"
								onclick={() => {
									nav(-1);
								}}
							>
								{l.t('_p.error.backPrev')}
							</Button>
							<RetryButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 500:
				text = l.t('_p.error.internalServerError');
				return (
					<Result palette="error" title={text} illustration={<illustrations.Error500 text={text} />}>
						<div class={styles['error-actions']}>
							<Button palette="primary" type="a" href={opt.routes.private.home}>
								{l.t('_p.error.backHome')}
							</Button>
							<Button
								palette="primary"
								onclick={() => {
									nav(-1);
								}}
							>
								{l.t('_p.error.backPrev')}
							</Button>
							<RetryButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 503:
				text = l.t('_p.error.serverUnavailable');
				return (
					<Result palette="error" title={text} illustration={<illustrations.Error503 text={text} />}>
						<div class={styles['error-actions']}>
							<Button palette="primary" type="a" href={opt.routes.private.home}>
								{l.t('_p.error.backHome')}
							</Button>
							<Button
								palette="primary"
								onclick={() => {
									nav(-1);
								}}
							>
								{l.t('_p.error.backPrev')}
							</Button>
							<Button palette="primary" onclick={() => window.location.reload()}>
								{l.t('_c.refresh')}
							</Button>
							<RetryButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			case 504:
				text = l.t('_p.error.gatewayTimeout');
				return (
					<Result palette="error" title={text} illustration={<illustrations.Error504 text={text} />}>
						<div class={styles['error-actions']}>
							<Button palette="primary" type="a" href={opt.routes.private.home}>
								{l.t('_p.error.backHome')}
							</Button>
							<Button
								palette="primary"
								onclick={() => {
									nav(-1);
								}}
							>
								{l.t('_p.error.backPrev')}
							</Button>
							<RetryButton retry={err.headers?.get('Retry-After')} />
						</div>
					</Result>
				);
			default:
				return unknown(l.t('_p.error.unknownError'));
		}
	} else if (err instanceof Error) {
		// TODO: 改为 Error.isError https://caniuse.com/?search=isError
		console.error(err.name, err.message);
		return unknown(err.name, err.message);
	}

	console.error(err);
	return unknown(l.t('_p.error.unknownError'), err.toString());
}

/**
 * 根据 Retry-After 头部信息显示重试按钮
 */
function RetryButton(props: { retry?: string | null }): JSX.Element {
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
