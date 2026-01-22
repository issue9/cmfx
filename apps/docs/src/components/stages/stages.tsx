// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Nav, Page, useLocale } from '@cmfx/components';
import { Type } from '@cmfx/vite-plugin-api';
import { A, useCurrentMatches } from '@solidjs/router';
import { For, JSX, ParentProps, Show } from 'solid-js';
import IconGithub from '~icons/icon-park-outline/github';

import pkg from '../../../package.json';
import { API } from './api';
import { default as Stage, Props as StageProps } from './stage';
import styles from './style.module.css';

// 演示文件的基地址
const baseURL = pkg.repository.url + '/tree/master/' + pkg.repository.directory + '/src/components/demo/';

export interface Props extends ParentProps {
    /**
     * 演示文件相对于 apps/docs/src/components/demo 的目录
     */
    dir: string;

    /**
     * 所有展示舞台
     */
    stages?: Array<StageProps>;

    /**
     * 常见问题
     */
    faq?: JSX.Element;

    /**
     * API 内容
     */
    api?: Array<Type>;
}

/**
 * 组件展示组件
 */
export default function Stages(props: Props):JSX.Element {
    const l = useLocale();

    const route = useCurrentMatches()();
    const title = route[route.length - 1].route.info?.title;

    let articleRef: HTMLElement;
    const url = baseURL + props.dir;

    return <Page class={styles['stages-page']} title={title}>
        <article class={styles.root} ref={el => articleRef = el}>
            <h2>
                {l.t(title)}
                <A class={styles.edit} href={url} title={l.t('_d.stages.editOnGithub')}><IconGithub /></A>
            </h2>

            <div>{props.children}</div>

            <Show when={props.stages}>
                {stages =><>
                    <h3>{l.t('_d.stages.codeDemo')}</h3>
                    <div class={styles.stages}>
                        <For each={stages()}>
                            {stage => <Stage {...stage} />}
                        </For>
                    </div>
                </>}
            </Show>

            <Show when={props.api}>
                {apis =>
                    <article class={styles.apis}>
                        <h3>{l.t('_d.stages.api')}</h3>
                        <For each={apis()}>
                            {api => <API api={api} />}
                        </For>
                    </article>
                }
            </Show>

            <Show when={props.faq}>
                {faq =>
                    <article>
                        <h3>{l.t('_d.stages.faq')}</h3>
                        {faq()}
                    </article>
                }
            </Show>
        </article>

        <Nav minHeaderCount={5} class={styles.nav} target={articleRef!} query='h3,h4' />
    </Page>;
}
