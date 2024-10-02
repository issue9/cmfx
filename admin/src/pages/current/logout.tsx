// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import { useApp, useOptions } from '@/app/context';

export default function(): JSX.Element {
    const ctx = useApp();
    const nav = useNavigate();
    const opt = useOptions();

    ctx.logout().then(()=>{
        nav(opt.routes.public.home);
    });
    return <></>;
}