// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/components';
import { useParams } from '@solidjs/router';
import { JSX } from 'solid-js';

import { Message } from '../locales';

export default function Test(): JSX.Element {
    const ps = useParams();
    const l = useLocale();
    l.t<Message>('home');
    console.log(ps.id);

    return <div>{l.t<Message>('nest.abc') as string},{ ps.id}</div>;
}
