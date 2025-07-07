// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, For, JSX, Match, Switch } from 'solid-js';

import { BaseProps, joinClass, Palette } from '@/base';
import { IconComponent } from '@/icon';
import { Ref, Step as WizardStep } from '@/wizard/step';
import styles from './style.module.css';

export type { Ref } from '@/wizard/step';

export interface Step extends WizardStep {
    /**
     * 图标，如果值为 true，表示采用数字，否则为图标。
     */
    icon?: IconComponent | true | { (completed?: boolean): IconComponent | true };
}

export interface Props extends BaseProps {
    steps: Array<Step>;

    /**
     * 指定已完成的步骤，非响应式的属性。
     */
    index?: number;

    /**
     * 已完成项的色盘
     */
    accentPalette: Palette;

    ref?: { (ref: Ref): void; };
}

export default function Stepper(props: Props): JSX.Element {
    const [index, setIndex] = createSignal(props.index ?? 0);

    if(props.ref) {
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
        });
    }

    return <div class={styles.stepper}>
        <header>
            <For each={props.steps}>
                {(step, idx) => {
                    const completed = createMemo(() => idx() <= index());
                    return <div class={joinClass(styles.step, completed() ? styles.completed : undefined)}>
                        <div class={styles.circle}>
                            <Switch fallback={<span class={styles.dot} />}>
                                <Match when={(step.icon === true || (typeof step.icon === 'function' && step.icon(completed()) === true))}>
                                    {idx() + 1}
                                </Match>
                                <Match when={((typeof step.icon === 'function' ? step.icon(completed()) : step.icon))}>
                                    {(componentFunc) => (componentFunc as IconComponent)({})}
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
