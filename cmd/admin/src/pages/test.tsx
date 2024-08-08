// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useApp } from 'admin/dev';
import { MessageKey } from '../locales';

export default function Test() {
    const ctx = useApp();
    ctx.t<MessageKey>('home');

    return <div>{ ctx.t<MessageKey>('nest.abc') as string }</div>;
}
