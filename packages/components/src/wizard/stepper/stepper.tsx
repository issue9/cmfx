// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Match, createSignal } from 'solid-js';

import { BaseProps, Palette } from '@/base';
import { Icon, IconSymbol } from '@/icon';
import { Step as BaseStep, Ref } from '@/wizard/step';
import { Switch } from 'solid-js';

export interface Step extends BaseStep {
    /**
     * 图标，如果值为 true，表示采用数字，否则为图标，如果其它空值表示不需要，显示为一个小点。
     */
    icon?: IconSymbol | true;
}

export interface Props extends BaseProps {
    steps: Array<Step>;

    /**
     * 指定已完成的步骤
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
                if (i > props.steps.length) {
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
                        <div>{step.title}</div>
                    </div>
                )}
            </For>
        </header>
    </div>;
}
