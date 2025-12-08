// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Result } from '@cmfx/components';
import { API } from '@cmfx/core';
import * as illustrations from '@cmfx/illustrations';
import { Navigate, useLocation, useNavigate } from '@solidjs/router';
import { createMemo, JSX } from 'solid-js';

import { useAdmin, useLocale, HTTPError } from '@/context';
import styles from './style.module.css';

/**
 * 404 错误
 */
export function NotFound(): JSX.Element {
    const l = useLocale();
    const [, , opt] = useAdmin();
    const nav = useNavigate();

    const text = createMemo(() => { return l.t('_p.error.pageNotFound'); });

    return <Result palette='error' title={text()} illustration={<illustrations.Error404 text={text()} />}>
        <div class={styles['error-actions']}>
            <Button palette='primary' type='a' href={opt.routes.private.home}>{l.t('_p.error.backHome')}</Button>
            <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
        </div>
    </Result>;
}

/**
 * 错误处理方法，尽可能地抛出 {@link HTTPError} 对象，可以显示更明确的错误页面。
 */
export function ErrorHandler(props: { err: Error | any }): JSX.Element {
    const [, , opt] = useAdmin();
    const nav = useNavigate();
    const l = useLocale();

    // 未知错误
    const unknown = (title: string, msg?: string) => {
        return <Result palette='error' title={title} description={msg} illustration={<illustrations.BUG />}>
            <div class={styles['error-actions']}>
                <Button palette='primary' type='a' href={opt.routes.private.home}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </div>
        </Result>;
    };

    const err = props.err;
    if (err instanceof HTTPError) {
        console.error(err.message, err.stack);

        let text: string;
        switch (err.status) {
        case API.ErrorCode:
            return unknown(err.title, err.message);
        case 400:
            text = l.t('_p.error.badRequest');
            return <Result palette='error' title={text} illustration={<illustrations.Error400 text={text} />}>
                <div class={styles['error-actions']}>
                    <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                    <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
                </div>
            </Result>;
        case 401:
            const loc = useLocation();
            if (loc.pathname !== opt.routes.public.home) {
                return <Navigate href={/*@once*/opt.routes.public.home} />;
            }

            text = l.t('_p.error.unauthorized');
            return <Result palette='error' title={text} illustration={<illustrations.Error401 text={text} />}>
                <div class={styles['error-actions']}>
                    <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                    <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
                </div>
            </Result>;
        case 403:
            text = l.t('_p.error.forbidden');
            return <Result palette='error' title={text} illustration={<illustrations.Error403 text={text} />}>
                <div class={styles['error-actions']}>
                    <Button palette='primary' type='a' href={opt.routes.private.home}>{l.t('_p.error.backHome')}</Button>
                    <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                    <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
                </div>
            </Result>;
        case 404:
            return NotFound();
        case 429:
            text = l.t('_p.error.tooManyRequests');
            return <Result palette='error' title={text} illustration={<illustrations.Error429 text={text} />}>
                <div class={styles['error-actions']}>
                    <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                    <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
                </div>
            </Result>;
        case 500:
            text = l.t('_p.error.internalServerError');
            return <Result palette='error' title={text} illustration={<illustrations.Error500 text={text} />}>
                <div class={styles['error-actions']}>
                    <Button palette='primary' type='a' href={opt.routes.private.home}>{l.t('_p.error.backHome')}</Button>
                    <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                    <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
                </div>
            </Result>;
        case 503:
            text = l.t('_p.error.serverUnavailable');
            return <Result palette='error' title={text} illustration={<illustrations.Error503 text={text} />}>
                <div class={styles['error-actions']}>
                    <Button palette='primary' type='a' href={opt.routes.private.home}>{l.t('_p.error.backHome')}</Button>
                    <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                    <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
                </div>
            </Result>;
        case 504:
            text = l.t('_p.error.gatewayTimeout');
            return <Result palette='error' title={text} illustration={<illustrations.Error504 text={text} />}>
                <div class={styles['error-actions']}>
                    <Button palette='primary' type='a' href={opt.routes.private.home}>{l.t('_p.error.backHome')}</Button>
                    <Button palette='primary' onclick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                    <Button palette='primary' onclick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
                </div>
            </Result>;
        default:
            return unknown(l.t('_p.error.unknownError'));
        }
    } else if (err instanceof Error) { // TODO: 改为 Error.isError https://caniuse.com/?search=isError
        console.error(err.message, err.stack);
        return unknown(err.name, err.message);
    }

    console.error(err);
    return unknown(l.t('_p.error.unknownError'));
}
