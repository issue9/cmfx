// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { useApp } from '@cmfx/admin/components';
import { Message } from '../locales';

export default function Test() {
    const ctx = useApp();
    ctx.locale().t<Message>('home');
    const ps = ctx.params();
    console.log(ps.id);

    return <div>{ctx.locale().t<Message>('nest.abc') as string},{ ps.id}</div>;
}
