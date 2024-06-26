// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSXElement } from 'solid-js';

import { useApp } from '@/pages/app';

export default function(): JSXElement {
    const ctx = useApp();

    return <form class="items-center flex justify-center flex-col gap-2">
        <p>{ctx.t('_internal.login.title')}</p>
        <input name="username" />
        <input name="password" />
        <button type="submit" class="primary-button">{ctx.t('_internal.ok') as string}</button>
    </form>;
}
