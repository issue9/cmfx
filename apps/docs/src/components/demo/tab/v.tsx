// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, TabItem, Transition } from '@cmfx/components';
import { createSignal, Switch, Match } from 'solid-js';

export default function() {
    const items: Array<TabItem> = [
        { id: 'k1', label: 'K1' },
        { id: 'k2', label: 'K2222222' },
        { id: 'k3', label: 'K3', disabled: true },
        { id: 'k4', label: 'K4' },
    ];
    const [tab, setTab] = createSignal('k1');

    return <Tab layout='vertical' palette='primary' items={structuredClone(items)} onChange={setTab}>
        <Transition>
            <Switch>
                <Match when={tab() === 'k1'}>
                    <div>Panel for K1</div>
                </Match>
                <Match when={tab() === 'k2'}>
                    <div>Panel for K2</div>
                </Match>
                <Match when={tab() === 'k3'}>
                    <div>Panel for K3</div>
                </Match>
                <Match when={tab() === 'k4'}>
                    <div>Panel for K4</div>
                </Match>
            </Switch>
        </Transition>
    </Tab>;
}
