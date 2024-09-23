// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate, useParams } from '@solidjs/router';
import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Button, Page } from '@/components';

export default function(): JSX.Element {
    const ctx = useApp();
    const ps = useParams<{id: string}>();
    const nav = useNavigate();

    return <Page title="_i.page.admin.admin">
        <div class="flex justify-end gap-2">
            <div>{ps.id}</div>
            <Button palette='secondary' onClick={()=>nav(-1)}>{ctx.locale().t('_i.cancel')}</Button>
            <Button palette='primary'>{ctx.locale().t('_i.ok')}</Button>
        </div>
    </Page>;
}
