// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, For, JSX, Match, mergeProps, Switch } from 'solid-js';

import { BaseProps, joinClass, Layout, RefProps } from '@/base';
import { Ref as WizardRef, Step as WizardStep } from '@/wizard/step';
import styles from './style.module.css';

export interface Ref extends WizardRef {
    root(): HTMLDivElement;
}

export interface Step extends WizardStep {
    /**
     * 图标，如果值为 true，表示采用数字，否则为图标。
     */
    icon?: JSX.Element | true | { (completed?: boolean): JSX.Element | true };
}

export interface Props extends BaseProps, RefProps<Ref> {
    steps: Array<Step>;

    /**
     * 指定已完成的步骤，非响应式的属性。
     */
    index?: number;

    /**
     * 布局
     *
     * @reactive
     */
    layout?: Layout;
}

const presetProps: Partial<Props> = {
    layout: 'horizontal'
} as const;

export default function Stepper(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [index, setIndex] = createSignal(props.index ?? 0);

    return <div class={joinClass(props.palette, props.layout === 'vertical' ? styles.vertical : '', styles.stepper, props.class)}
        style={ props.style } ref={el => {
            if (props.ref) {
                props.ref({
                    next: () => {
                        const i = index() + 1;
                        if (i > props.steps.length - 1) {
                            return;
                        }
                        setIndex(i);
                    },
                    prev: () => {
                        const i = index() - 1;
                        if (i < 0) {
                            return;
                        }
                        setIndex(i);
                    },
                    root: () => el
                });
            }
        }}
    >
        <header class={props.layout === 'vertical' ? styles.vertical : undefined}>
            <For each={props.steps}>
                {(step, idx) => {
                    const completed = createMemo(() => idx() <= index());
                    return <div class={joinClass(undefined, styles.step, completed() ? styles.completed : undefined)}>
                        <div class={styles.icon}>
                            <Switch fallback={<span class={styles.dot} />}>
                                <Match when={(step.icon === true || (typeof step.icon === 'function' && step.icon(completed()) === true))}>
                                    {idx() + 1}
                                </Match>
                                <Match when={((typeof step.icon === 'function' ? step.icon(completed()) : step.icon))}>
                                    {componentFunc => componentFunc()}
                                </Match>
                            </Switch>
                        </div>
                        <div class={styles.title}>{step.title}</div>
                    </div>;
                }}
            </For>
        </header>
        <div class={styles.content}>{props.steps[index()].content}</div>
    </div>;
}
