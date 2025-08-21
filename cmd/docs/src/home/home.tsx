// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { LinkButton, use, useLocale } from '@cmfx/components';

import styles from './style.module.css';

export default function Home() {
    const [, , opt] = use();
    const l = useLocale();

    return <div class={styles.home}>
        <h1>{opt.title}</h1>
        <p innerHTML={l.t('_d.home.desc', {
            go: '<a href="https://go.dev">Go</a>',
            solidjs: '<a href="https://www.solidjs.com">Solid</a>'
        })} />
        <LinkButton class="px-3 py-2" kind='border' href="/docs">{l.t('_d.home.start')}</LinkButton>
    </div>;
}
