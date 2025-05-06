// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Match, Switch, createSignal } from 'solid-js';

import { BaseProps, Palette } from '@/base';
import { Icon, IconSymbol } from '@/icon';
import { Ref, Step } from '@/wizard/step';

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

    return <div class="c--stepper">
        <header>
            <For each={props.steps}>
                {(step, idx) => (
                    <div classList={{ 'step': true, 'completed': idx() <= index() }}>
                        <Switch>
                            <Match when={!step.icon}><span class="dot" /></Match>
                            <Match when={step.icon === true}>
                                <span class="number">{idx() + 1}</span>
                            </Match>
                            <Match when={typeof step.icon === 'string'}>
                                <Icon class="icon" icon={step.icon as IconSymbol} />
                            </Match>
                        </Switch>
                        <div class="title">{step.title}</div>
                    </div>
                )}
            </For>
        </header>
        <div class="content">{props.steps[index()].content}</div>
    </div>;
}
