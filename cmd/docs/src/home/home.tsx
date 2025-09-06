// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { LinkButton, useComponents, useLocale } from '@cmfx/components';
import IconGithub from '~icons/icon-park-outline/github';

import pkg from '../../package.json';
import styles from './style.module.css';

export default function Home() {
    const [, , opt] = useComponents();
    const l = useLocale();

    return <div class={styles.home}>
        <h2>{opt.title}</h2>
        <p innerHTML={l.t('_d.home.desc', {
            go: '<a href="https://go.dev">Go</a>',
            solidjs: '<a href="https://www.solidjs.com">Solid</a>'
        })} />
        <nav>
            <LinkButton class="px-3 py-2" kind='fill' href="/docs" palette='primary'>
                {l.t('_d.home.start')}
            </LinkButton>

            <LinkButton class="px-3 py-2" kind='border' href={pkg.homepage}>
                <IconGithub class="me-1" />Github
            </LinkButton>
        </nav>
    </div>;
}
