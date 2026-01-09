// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Checkbox, Nav, Page, Table, useLocale } from '@cmfx/components';
import { Type } from '@cmfx/vite-plugin-api';
import { A, useCurrentMatches } from '@solidjs/router';
import { For, JSX, Match, ParentProps, Show, Switch } from 'solid-js';
import IconGithub from '~icons/icon-park-outline/github';

import pkg from '../../package.json';
import { markdown } from './markdown';
import { default as Stage, Props as StageProps } from './stage';
import styles from './style.module.css';

// 演示文件的基地址
const baseURL = pkg.repository.url + '/tree/master/' + pkg.repository.directory;

export interface Props extends ParentProps {
    /**
     * 演示文件相对于 src 所在的目录
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
    const url = baseURL + '/src/' + props.dir;

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

        <Nav minHeaderCount={5} class={styles.nav} target={articleRef!} query='h3,h4,h5,h6' />
    </Page>;
}

function tscode(code?: string): string {
    return code ? markdown('```ts\n' + code.trim() + '\n```') : '';
}

function buildAPI(api: Type): JSX.Element {
    const l = useLocale();

    return <section class={styles.api}>
        <h4>{api.name}</h4>
        <Show when={api.summary}>{summary =>
            <p innerHTML={markdown(summary())} />
        }</Show>
        <Show when={api.remarks}>{remarks =>
            <p innerHTML={markdown(remarks())} />
        }</Show>
        <Switch>
            <Match when={api.kind === 'variable' ? api : undefined}>
                {v =>
                    <p>{markdown(`${v().name} = ${v().value}`)}</p>
                }
            </Match>

            <Match when={api.kind === 'function' ? api : undefined}>
                {fn =>
                    <p>{markdown(`${fn().name}(${fn().parameters.map(p => p.name).join(', ')})`)}</p>
                }
            </Match>

            <Match when={api.kind === 'class' ? api : undefined}>
                {cls =>
                    <Table hoverable>
                        <thead>
                            <tr>
                                <th>{l.t('_d.stages.param')}</th>
                                <th>{l.t('_d.stages.type')}</th>
                                <th>{l.t('_d.stages.init')}</th>
                                <th>{l.t('_d.stages.desc')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={cls().properties}>
                                {field => (
                                    <tr>
                                        <th>{field.name}</th>
                                        <td innerHTML={tscode(field.type)} />
                                        <td innerHTML={tscode(field.def)} />
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
                }
            </Match>

            <Match when={api.kind === 'interface' ? api : undefined}>
                {intf =>
                    <Table hoverable>
                        <thead>
                            <tr>
                                <th>{l.t('_d.stages.param')}</th>
                                <th>{l.t('_d.stages.type')}</th>
                                <th>{l.t('_d.stages.preset')}</th>
                                <th>{l.t('_d.stages.reactive')}</th>
                                <th>{l.t('_d.stages.desc')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={intf().properties}>
                                {field => (
                                    <tr>
                                        <th>{field.name}</th>
                                        <td innerHTML={tscode(field.type)} />
                                        <td innerHTML={tscode(field.def)} />
                                        <td>
                                            <Show when={field.reactive} fallback={<Checkbox class={styles.chk} readonly />}>
                                                <Checkbox class={styles.chk} checked readonly />
                                            </Show>
                                        </td>
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
                }
            </Match>
        </Switch>
    </section>;
}
