// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX, onMount } from 'solid-js';

import { useApp, useOptions } from '@/app/context';

export default function(): JSX.Element {
    const ctx = useApp();
    const nav = useNavigate();
    const opt = useOptions();

    onMount(async()=>{
        await ctx.logout();
        nav(opt.routes.public.home);
    })

    return <></>;
}
