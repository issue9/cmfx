// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ErrorProps, Error as XError } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { use, useLocale } from '@/context';

export function NotFound(): JSX.Element {
    const l = useLocale();
    const [, , opt] = use();
    const nav = useNavigate();

    return <XError header="404" title={l.t('_i.error.pageNotFound')}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{ l.t('_i.error.backHome') }</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{ l.t('_i.error.backPrev') }</Button>
    </XError>;
}

/**
 * 一些未知的错误统一使用此方法
 */
export function Unknown(err: any) {
    const l = useLocale();
    const [, , opt] = use();
    const nav = useNavigate();

    const props: ErrorProps = {};
    if (err instanceof Error) { // TODO: 改为 Error.isError https://caniuse.com/?search=isError
        props.header = err.name;
        props.title = err.message;
        props.detail = err.stack;
    }else{
        props.title = err.toString();
    }

    return <XError header={props.header ?? l.t('_i.error.unknownError')} title={props.title} detail={props.detail}>
        <Button palette='primary' onClick={() => { nav(opt.routes.private.home); }}>{ l.t('_i.error.backHome') }</Button>
        <Button palette='primary' onClick={() => { nav(-1); }}>{ l.t('_i.error.backPrev') }</Button>
        <Button palette='primary' onClick={() => window.location.reload()}>{l.t('_i.refresh')}</Button>
    </XError>;
}
