// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { Button, ErrorProps, Error as XError, useApp, useOptions } from '@admin/components';

export function NotFound(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    const nav = useNavigate();

    return <XError header="404" title={ctx.locale().t('_i.error.pageNotFound')}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{ ctx.locale().t('_i.error.backHome') }</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{ ctx.locale().t('_i.error.backPrev') }</Button>
    </XError>;
}

/**
 * 一些未知的错误统一使用此方法
 */
export function Unknown(err: any) {
    const ctx = useApp();
    const opt = useOptions();
    const nav = useNavigate();

    const props: ErrorProps = {};
    if (err instanceof Error) {
        props.header = err.name;
        props.title = err.message;
        props.detail = err.stack;
    }else{
        props.title = err.toString();
    }

    return <XError header={props.header ?? ctx.locale().t('_i.error.unknownError')} title={props.title} detail={props.detail}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{ ctx.locale().t('_i.error.backHome') }</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{ ctx.locale().t('_i.error.backPrev') }</Button>
        <Button palette='primary' onClick={() => window.location.reload()}>{ctx.locale().t('_i.refresh')}</Button>
    </XError>;
}
