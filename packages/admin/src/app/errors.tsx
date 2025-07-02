// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, illustrations, Error as XError } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { createMemo, JSX } from 'solid-js';

import { use, useLocale } from '@/context';

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
    const [, , opt] = use();
    const nav = useNavigate();

    const text = createMemo(() => { return l.t('_p.error.pageNotFound'); });

    return <XError title={text()} illustration={<illustrations.Error404 text={text()} />}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
    </XError>;
}

/**
 * 错误处理方法，尽可能地抛出 {@link HTTPError} 对象，可以显示更明确的错误页面。
 */
export function ErrorHandler(props: { err: Error | any }): JSX.Element {
    const [, , opt] = use();
    const nav = useNavigate();
    const l = useLocale();

    // 未知错误
    const unknown = (title: string) => {
        return <XError title={title} illustration={<illustrations.BUG />}>
            <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
            <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
            <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
        </XError>;
    };

    const err = props.err;
    if (err instanceof HTTPError) {
        console.error(err.message, err.stack);

        let text: string;
        switch (err.status) {
        case 400:
            text = l.t('_p.error.badRequest');
            return <XError title={text} illustration={<illustrations.Error400 text={text} />}>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </XError>;
        case 401:
            text = l.t('_p.error.unauthorized');
            return <XError title={text} illustration={<illustrations.Error401 text={text} />}>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </XError>;
        case 403:
            text = l.t('_p.error.forbidden');
            return <XError title={text} illustration={<illustrations.Error403 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </XError>;
        case 404:
            return NotFound();
        case 429:
            text = l.t('_p.error.tooManyRequests');
            return <XError title={text} illustration={<illustrations.Error429 text={text} />}>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </XError>;
        case 500:
            text = l.t('_p.error.internalServerError');
            return <XError title={text} illustration={<illustrations.Error500 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </XError>;
        case 503:
            text = l.t('_p.error.serverUnavailable');
            return <XError title={text} illustration={<illustrations.Error503 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </XError>;
        case 504:
            text = l.t('_p.error.gatewayTimeout');
            return <XError title={text} illustration={<illustrations.Error504 text={text} />}>
                <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{l.t('_p.error.backHome')}</Button>
                <Button palette='primary' onClick={() => { nav(-1); }}>{l.t('_p.error.backPrev')}</Button>
                <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_c.refresh')}</Button>
            </XError>;
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
