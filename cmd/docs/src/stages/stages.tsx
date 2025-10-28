// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Checkbox, Nav, Page, Table, useLocale } from '@cmfx/components';
import { Object } from '@cmfx/vite-plugin-api';
import { useCurrentMatches } from '@solidjs/router';
import { For, JSX, Match, ParentProps, Show, Switch } from 'solid-js';

import { default as Stage, Props as StageProps } from './stage';
import { markdown } from './markdown';
import styles from './style.module.css';

export interface Props extends ParentProps {
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

/**
 * 组件展示组件
 */
export default function Stages(props: Props):JSX.Element {
    const l = useLocale();

    const route = useCurrentMatches()();
    const title = route[route.length - 1].route.info?.title;

    let articleRef: HTMLElement;

    return <Page class={styles.page} title={title}>
        <article class={styles.root} ref={el => articleRef = el}>
            <h2>{l.t(title)}</h2>

            <div>{props.children}</div>

            <h3>{l.t('_d.stages.codeDemo')}</h3>
            <div class={styles.stages}>
                <For each={props.stages}>
                    {stage => <Stage {...stage} />}
                </For>
            </div>

            <Show when={props.api}>
                {apis =>
                    <article class={styles.apis}>
                        <h3>{l.t('_d.stages.api')}</h3>
                        <For each={apis()}>
                            {api => buildAPI(api)}
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

        <Nav class={styles.nav} target={articleRef!} query='h3,h4,h5,h6' />
    </Page>;
}

function buildAPI(api: Object): JSX.Element {
    const l = useLocale();
    const isFunc = api.fields && api.type;

    return <section class={styles.api}>
        <h4>{api.name}</h4>
        <Show when={api.summary}>{summary =>
            <p innerHTML={markdown(summary())} />
        }</Show>
        <Show when={api.remarks}>{remarks =>
            <p innerHTML={markdown(remarks())} />
        }</Show>
        <Switch fallback={<code>{`${api.name} = ${api.type}`}</code>}>
            <Match when={api.fields}>
                <Show when={api.type}>{c => <code>{c()}</code>}</Show>
                <Table hoverable>
                    <thead>
                        <tr>
                            <th>{l.t('_d.stages.param')}</th>
                            <th>{l.t('_d.stages.type')}</th>
                            <th>{l.t('_d.stages.preset')}</th>
                            <Show when={!isFunc}><th>{l.t('_d.stages.reactive')}</th></Show>
                            <th>{l.t('_d.stages.desc')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={api.fields}>
                            {field => (
                                <tr>
                                    <th>{field.name}</th>
                                    <td>{field.type}</td>
                                    <td>{field.preset}</td>
                                    <Show when={!isFunc}>
                                        <td>
                                            <Show when={field.reactive} fallback={<Checkbox class={styles.chk} readonly />}>
                                                <Checkbox class={styles.chk} checked readonly />
                                            </Show>
                                        </td>
                                    </Show>
                                    <td>
                                        <Show when={field.summary}>{summary =>
                                            <p innerHTML={markdown(summary())} />
                                        }</Show>
                                        <Show when={field.remarks}>{remarks =>
                                            <p innerHTML={markdown(remarks())} />
                                        }</Show>
                                    </td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </Table>
            </Match>
        </Switch>
    </section>;
}
