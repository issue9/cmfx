// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page, useLocale } from '@cmfx/components';
import { For, JSX, ParentProps, Show } from 'solid-js';

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
}

export default function Stages(props: Props):JSX.Element {
    const l = useLocale();

    return <Page title={props.title} class={styles.page}>
        <h2 class='text-5xl'>{ props.title }</h2>

        <div>{ props.children }</div>

        <h3 class='text-3xl'>{ l.t('_d.stages.codeDemo') }</h3>
        <div class={styles.stages}>
            <For each={props.stages}>
                {stage => <Stage {...stage} />}
            </For>
        </div>

        <Show when={props.faq}>
            <article>
                <h3 class='text-3xl'>FAQ</h3>
                {props.faq}
            </article>
        </Show>

    </Page>;
}
