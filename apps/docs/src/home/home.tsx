// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, SplitButton, useLocale, useOptions } from '@cmfx/components';
import { createEffect } from 'solid-js';
import IconGithub from '~icons/icon-park-outline/github';
import IconStart from '~icons/mdi/read-more';
import IconAI from '~icons/mingcute/ai-fill';
import IconGitee from '~icons/simple-icons/gitee';

import pkg from '../../package.json';
import styles from './style.module.css';

export default function Home() {
    const [act, opt] = useOptions();
    const l = useLocale();

    createEffect(() => {
        act.setTitle(l.t('_d.main.home'));
    });

    return <div class={styles.home}>
        <h2>{opt.title}</h2>
        <p innerHTML={l.t('_d.home.desc', {
            go: '<a href="https://go.dev">Go</a>',
            solidjs: '<a href="https://www.solidjs.com">Solid</a>'
        })} />
        <nav>
            <Button type='a' class={styles.btn} kind='fill' href="/docs" palette='primary'>
                <IconStart class="me-1" />
                {l.t('_d.home.start')}
            </Button>

            <SplitButton type='a' class={styles.btn} kind='fill' href={pkg.repository.url} menus={[
                {
                    type: 'a',
                    label: <><IconGitee class="me-1" />Gitee</>,
                    href: 'https://gitee.com/issue9/cmfx',
                }
            ]}>
                <IconGithub class="me-1" />Github
            </SplitButton>

            <SplitButton type='a' class={styles.btn} kind='fill' href="https://deepwiki.com/issue9/cmfx" menus={[
                {
                    type: 'a',
                    label: 'zread',
                    href: 'https://zread.ai/issue9/cmfx'
                }
            ]}>
                <IconAI class='me-1' /> DeepWiki
            </SplitButton>
        </nav>
    </div>;
}
