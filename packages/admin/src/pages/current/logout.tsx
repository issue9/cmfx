// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page, IconCmfxBrandAnimate, useLocale } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX, onMount } from 'solid-js';

import { useAdmin } from '@/context';
import styles from './style.module.css';

export function Logout(): JSX.Element {
    const [, ctx, opt] = useAdmin();
    const l = useLocale();
    const nav = useNavigate();

    onMount(async () => {
        await ctx.logout();
        nav(opt.routes.public.home);
    });

    // 在网络不通时，ctx.logout 可能会非常耗时，所以此处展示一个简单的提示页面。
    return <Page title="_p.current.logout" class={styles.logout}>
        <IconCmfxBrandAnimate />{l.t('_p.current.loggingOut')}
    </Page>;
}
