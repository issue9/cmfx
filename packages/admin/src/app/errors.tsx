// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, illustrations, Result } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { createMemo, JSX } from 'solid-js';

import { useAdmin, useLocale } from '@/context';

export class HTTPError extends Error {
    #status: number;

    constructor(status: number, message: string) {
        super(message);
        this.#status = status;
    }

    get status(): number { return this.#status; }
}

/**
 * 404 错误
 */
export function NotFound(): JSX.Element {
    const l = useLocale();
    const [, , opt] = useAdmin();
    const nav = useNavigate();

    const text = createMemo(() => { return l.t('_p.error.pageNotFound'); });

    return <Result title={text()} illustration={<illustrations.Error404 text={text()} />}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
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
    const unknown = (title: string) => {
        return <Result title={title} illustration={<illustrations.BUG />}>
            <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
            <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
            <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
        </Result>;
    };

    const err = props.err;
    if (err instanceof HTTPError) {
        console.error(err.message, err.stack);

        let text: string;
        switch (err.status) {
        case 400:
            text = l.t('_p.error.badRequest');
            return <Result title={text} illustration={<illustrations.Error400 text={text} />}>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </Result>;
        case 401:
            text = l.t('_p.error.unauthorized');
            return <Result title={text} illustration={<illustrations.Error401 text={text} />}>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </Result>;
        case 403:
            text = l.t('_p.error.forbidden');
            return <Result title={text} illustration={<illustrations.Error403 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </Result>;
        case 404:
            return NotFound();
        case 429:
            text = l.t('_p.error.tooManyRequests');
            return <Result title={text} illustration={<illustrations.Error429 text={text} />}>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </Result>;
        case 500:
            text = l.t('_p.error.internalServerError');
            return <Result title={text} illustration={<illustrations.Error500 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </Result>;
        case 503:
            text = l.t('_p.error.serverUnavailable');
            return <Result title={text} illustration={<illustrations.Error503 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </Result>;
        case 504:
            text = l.t('_p.error.gatewayTimeout');
            return <Result title={text} illustration={<illustrations.Error504 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </Result>;
        default:
            return unknown(l.t('_p.error.unknownError'));
        }
    } else if (err instanceof Error) { // // TODO: 改为 Error.isError https://caniuse.com/?search=isError
        console.error(err.message, err.stack);
        return unknown(err.name);
    }

    console.error(err);
    return unknown(l.t('_p.error.unknownError'));
}
