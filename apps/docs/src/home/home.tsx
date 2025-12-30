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

            <SplitButton kind='fill' items={[
                {
                    type: 'a',
                    label: <><IconGitee class="me-1" />Gitee</>,
                    value: 'https://gitee.com/issue9/cmfx',
                }
            ]}>
                <Button class={styles.btn} type='a' href={pkg.repository.url}>
                    <IconGithub class="me-1" />Github
                </Button>
            </SplitButton>

            <SplitButton kind='fill' items={[
                {
                    type: 'a',
                    label: 'zread',
                    value: 'https://zread.ai/issue9/cmfx'
                }
            ]}>
                <Button class={styles.btn} type='a' href="https://deepwiki.com/issue9/cmfx">
                    <IconAI class='me-1' /> DeepWiki
                </Button>
            </SplitButton>
        </nav>
    </div>;
}
