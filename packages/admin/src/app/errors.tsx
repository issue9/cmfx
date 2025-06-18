// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Error as XError, illustrations } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { use, useLocale } from '@/context';

export function NotFound(): JSX.Element {
    const l = useLocale();
    const [, , opt] = use();
    const nav = useNavigate();

    return <XError title={l.t('_p.error.pageNotFound')} illustration={<illustrations.Error404 />}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{ l.t('_p.error.backHome') }</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{ l.t('_p.error.backPrev') }</Button>
    </XError>;
}

/**
 * 一些未知的错误统一使用此方法
 */
export function Unknown(err: any): JSX.Element {
    const l = useLocale();
    const [, , opt] = use();
    const nav = useNavigate();

    let title: string;
    if (err instanceof Error) { // TODO: 改为 Error.isError https://caniuse.com/?search=isError
        title = err.name;
        console.error(err.stack);
    }else{
        title = l.t('_p.error.unknownError');
        console.error(err.toString());
    }

    return <XError title={title} illustration={<illustrations.BUG />}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{ l.t('_p.error.backHome') }</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{ l.t('_p.error.backPrev') }</Button>
        <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_p.refresh')}</Button>
    </XError>;
}

export function Forbidden(): JSX.Element {
    const l = useLocale();
    const [, , opt] = use();
    const nav = useNavigate();

    return <XError title={l.t('_p.error.forbidden')} illustration={<illustrations.Error403 />}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{ l.t('_p.error.backHome') }</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{ l.t('_p.error.backPrev') }</Button>
    </XError>;
}
