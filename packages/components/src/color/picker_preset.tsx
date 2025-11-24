// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Signal } from 'solid-js';

import { Picker } from './picker';
import { joinClass } from '@/base';
import styles from './style.module.css';

export class PresetPicker implements Picker {
    readonly #values: Array<string>;

    constructor(...presets: Array<string>) {
        this.#values = presets;
    }

    get id(): string { return 'preset'; }
    get localeID(): string { return '_c.color.preset'; }
    include(value: string): boolean { return this.#values.includes(value); }

    panel(signal: Signal<string>): JSX.Element {
        return <div class={styles.presets}>
            <For each={this.#values}>
                {v =>
                    <span class={joinClass(undefined, styles.color, signal[0]() === v ? styles.selected : '')}
                        style={{ 'background': v }} onclick={() => {
                            signal[1](v);
                        }} />
                }
            </For>
        </div>;
    }
}
