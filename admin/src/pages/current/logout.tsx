// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX, onMount } from 'solid-js';

import { useApp, useOptions } from '@/app/context';
import { Page } from '@/components';

export function Logout(): JSX.Element {
    const ctx = useApp();
    const nav = useNavigate();
    const opt = useOptions();

    onMount(async () => {
        await ctx.logout();
        nav(opt.routes.public.home);
    });

    // 在网络不通时，ctx.logout 可能会非常耗时，所以此处展示一个简单的提示页面。
    return <Page title="_i.page.current.logout" class="p--logout">
        {ctx.locale().t('_i.page.current.loggingOut')}
    </Page>;
}
