// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Signal } from 'solid-js';

import { PickerPanel } from './picker';
import { joinClass } from '@/base';
import styles from './style.module.css';

/**
 * 用户自己提供一系列颜色的 {@link PickerPanel} 实现
 */
export class PresetPickerPanel implements PickerPanel {
    readonly #values: Array<string>;

    /**
     * 构造函数
     *
     * @param presets - 预设值列表；
     */
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
