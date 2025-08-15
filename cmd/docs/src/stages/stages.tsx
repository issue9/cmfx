// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page, useLocale } from '@cmfx/components';
import { Object } from '@cmfx/vite-plugin-api';
import { For, JSX, Match, ParentProps, Show, Switch } from 'solid-js';
import IconChecked from '~icons/material-symbols/select-check-box';

import { default as Stage, Props as StageProps } from './stage';
import styles from './style.module.css';

export interface Props extends ParentProps {
    /**
     * 页面标题
     */
    title: string;

    /**
     * 所有展示舞台
     */
    stages: Array<StageProps>;

    /**
     * 常见问题
     */
    faq?: JSX.Element;

    /**
     * API 内容
     */
    api?: Array<Object>;
}

export default function Stages(props: Props):JSX.Element {
    const l = useLocale();

    return <Page title={props.title} class={styles.page}>
        <h2>{props.title}</h2>

        <div>{props.children}</div>

        <h3>{l.t('_d.stages.codeDemo')}</h3>
        <div class={styles.stages}>
            <For each={props.stages}>
                {stage => <Stage {...stage} />}
            </For>
        </div>

        <Show when={props.api}>
            <article class={styles.apis}>
                <h3>{ l.t('_d.stages.api') }</h3>
                <For each={props.api}>
                    {api => (
                        <section class={styles.api}>
                            <h4>{api.name}</h4>
                            <p>{api.summary}</p>
                            <p>{api.remarks}</p>
                            <Switch fallback={<code>{ api.type }</code>}>
                                <Match when={api.fields}>
                                    <table class="cmfx-table">
                                        <thead>
                                            <tr>
                                                <th>{ l.t('_d.stages.param') }</th>
                                                <th>{ l.t('_d.stages.type') }</th>
                                                <th>{ l.t('_d.stages.preset') }</th>
                                                <th>{ l.t('_d.stages.reactive') }</th>
                                                <th>{ l.t('_d.stages.desc') }</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <For each={api.fields}>
                                                {field => (
                                                    <tr>
                                                        <th>{field.name}</th>
                                                        <td>{field.type}</td>
                                                        <td>{field.preset}</td>
                                                        <td>
                                                            <Show when={field.reactive}><IconChecked /></Show>
                                                        </td>
                                                        <td>{field.summary}<br />{field.remarks}</td>
                                                    </tr>
                                                )}
                                            </For>
                                        </tbody>
                                    </table>
                                </Match>
                            </Switch>
                        </section>
                    )}
                </For>
            </article>
        </Show>

        <Show when={props.faq}>
            <article>
                <h3>FAQ</h3>
                {props.faq}
            </article>
        </Show>

    </Page>;
}
