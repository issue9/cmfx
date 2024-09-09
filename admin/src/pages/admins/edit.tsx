// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';

import { Page,Button } from '@/components';
import { useApp } from '@/app';

export default function(): JSX.Element {
    const ctx = useApp();
    const ps = useParams<{id: string}>();
    const nav = useNavigate();

    return <Page title="_i.page.admin.admin">
        <div class="flex justify-end gap-2">
            <div>{ps.id}</div>
            <Button palette='secondary' onClick={()=>nav(-1)}>{ctx.t('_i.cancel')}</Button>
            <Button palette='primary'>{ctx.t('_i.ok')}</Button>
        </div>
    </Page>;
}
