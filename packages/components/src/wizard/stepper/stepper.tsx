// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Match, Switch, createMemo, createSignal } from 'solid-js';

import { BaseProps, Palette } from '@/base';
import { Icon, IconSymbol } from '@/icon';
import { Ref, Step as WizardStep } from '@/wizard/step';

export type { Ref } from '@/wizard/step';

export interface Step extends WizardStep {
    /**
     * 图标，如果值为 true，表示采用数字，否则为图标。
     */
    icon?: IconSymbol | true | { (completed?: boolean): IconSymbol | true };
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

    return <div class="c--stepper">
        <header>
            <For each={props.steps}>
                {(step, idx) => {
                    const completed = createMemo(() => idx() <= index());
                    return <div classList={{ 'step': true, 'completed': completed() }}>
                        <Switch>
                            <Match when={!step.icon}><span class="dot" /></Match>
                            <Match when={step.icon && (step.icon === true || (typeof step.icon === 'function' && step.icon(completed()) === true))}>
                                <span class="number">{idx() + 1}</span>
                            </Match>
                            <Match when={step.icon && ((typeof step.icon === 'function' ? step.icon(completed()) : step.icon))}>
                                {(icon) => (<Icon class="icon" icon={icon() as IconSymbol} />)}
                            </Match>
                        </Switch>
                        <div class="title">{step.title}</div>
                    </div>;
                }}
            </For>
        </header>
        <div class="content">{props.steps[index()].content}</div>
    </div>;
}
