// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useApp } from '@cmfx/admin/dev';
import { MessageKey } from '../locales';

export default function Test() {
    const ctx = useApp();
    ctx.locale().t<MessageKey>('home');
    const ps = ctx.params();
    console.log(ps.id);

    return <div>{ctx.locale().t<MessageKey>('nest.abc') as string},{ ps.id}</div>;
}
