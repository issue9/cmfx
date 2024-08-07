// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, useNavigate } from '@solidjs/router';

import { Button, ErrorProps, Error as XError } from '@/components';
import { useInternal } from './context';

export function NotFound() {
    const ctx = useInternal();
    return <XError header="404" title={ctx.t('_internal.error.pageNotFound')}>
        <div class="flex gap-x-5 justify-center">
            <A class="palette--primary c--button c--button-fill" href={ctx.options.routes.private.home}>{ ctx.t('_internal.error.backHome') }</A>
            <Button palette='primary' onClick={() => { useNavigate()(-1); }}>{ ctx.t('_internal.error.backPrev') }</Button>
        </div>
    </XError>;
}

/**
 * 一些未知的错误统一使用此方法
 */
export function Unknown(err: any) {
    const ctx = useInternal();

    const props: ErrorProps = {};
    if (err instanceof Error) {
        props.header = err.name;
        props.title = err.message;
        props.detail = err.stack;
    }else{
        props.title = err.toString();
    }

    return <XError header={props.header ?? ctx.t('_internal.error.unknownError')} title={props.title} detail={props.detail}>
        <A class="palette--primary c--button c--button-fill" href={ctx.options.routes.private.home}>{ ctx.t('_internal.error.backHome') }</A>
        <Button palette='primary' onClick={() => { useNavigate()(-1); }}>{ ctx.t('_internal.error.backPrev') }</Button>
        <Button palette='primary' onClick={() => window.location.reload()}>{ctx.t('_internal.refresh')}</Button>
    </XError>;
}
