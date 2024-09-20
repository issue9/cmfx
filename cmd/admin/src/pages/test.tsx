// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useApp } from 'admin/dev';
import { MessageKey } from '../locales';

export default function Test() {
    const ctx = useApp();
    ctx.locale().t<MessageKey>('home');

    return <div>{ ctx.locale().t<MessageKey>('nest.abc') as string }</div>;
}
