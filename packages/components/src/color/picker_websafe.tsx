// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Signal } from 'solid-js';

import { PickerPanel } from './picker';
import { joinClass } from '@/base';
import styles from './style.module.css';

const values: Array<string> = [
    '#000', '#003', '#006', '#009', '#00c', '#00f',
    '#030', '#033', '#036', '#039', '#03c', '#03f',
    '#060', '#063', '#066', '#069', '#06c', '#06f',
    '#090', '#093', '#096', '#099', '#09c', '#09f',
    '#0c0', '#0c3', '#0c6', '#0c9', '#0cc', '#0cf',
    '#0f0', '#0f3', '#0f6', '#0f9', '#0fc', '#0ff',

    '#300', '#303', '#306', '#309', '#30c', '#30f',
    '#330', '#333', '#336', '#339', '#33c', '#33f',
    '#360', '#363', '#366', '#369', '#36c', '#36f',
    '#390', '#393', '#396', '#399', '#39c', '#39f',
    '#3c0', '#3c3', '#3c6', '#3c9', '#3cc', '#3cf',
    '#3f0', '#3f3', '#3f6', '#3f9', '#3fc', '#3ff',

    '#600', '#603', '#606', '#609', '#60c', '#60f',
    '#630', '#633', '#636', '#639', '#63c', '#63f',
    '#660', '#663', '#666', '#669', '#66c', '#66f',
    '#690', '#693', '#696', '#699', '#69c', '#69f',
    '#6c0', '#6c3', '#6c6', '#6c9', '#6cc', '#6cf',
    '#6f0', '#6f3', '#6f6', '#6f9', '#6fc', '#6ff',

    '#900', '#903', '#906', '#909', '#90c', '#90f',
    '#930', '#933', '#936', '#939', '#93c', '#93f',
    '#960', '#963', '#966', '#969', '#96c', '#96f',
    '#990', '#993', '#996', '#999', '#99c', '#99f',
    '#9c0', '#9c3', '#9c6', '#9c9', '#9cc', '#9cf',
    '#9f0', '#9f3', '#9f6', '#9f9', '#9fc', '#9ff',

    '#c00', '#c03', '#c06', '#c09', '#c0c', '#c0f',
    '#c30', '#c33', '#c36', '#c39', '#c3c', '#c3f',
    '#c60', '#c63', '#c66', '#c69', '#c6c', '#c6f',
    '#c90', '#c93', '#c96', '#c99', '#c9c', '#c9f',
    '#cc0', '#cc3', '#cc6', '#cc9', '#ccc', '#ccf',
    '#cf0', '#cf3', '#cf6', '#cf9', '#cfc', '#cff',

    '#f00', '#f03', '#f06', '#f09', '#f0c', '#f0f',
    '#f30', '#f33', '#f36', '#f39', '#f3c', '#f3f',
    '#f60', '#f63', '#f66', '#f69', '#f6c', '#f6f',
    '#f90', '#f93', '#f96', '#f99', '#f9c', '#f9f',
    '#fc0', '#fc3', '#fc6', '#fc9', '#fcc', '#fcf',
    '#ff0', '#ff3', '#ff6', '#ff9', '#ffc', '#fff',
] as const;


/**
 * web 安全色的 {@link PickerPanel} 实现
 */
export class WebSafePickerPanel implements PickerPanel {
    readonly #disabled: Array<string> = [];

    /**
     * 构造函数
     *
     * @param disabled - 禁用的颜色列表；
     */
    constructor(...disabled: Array<string>) {
        this.#disabled = disabled ?? [];
    }

    get id(): string { return 'websafe'; }

    get localeID(): string { return '_c.color.websafe'; }

    include(value: string): boolean { return values.includes(value); }

    panel(s: Signal<string>): JSX.Element {
        return <div class={styles.vars}>
            <For each={values}>
                {v => {
                    const cls = joinClass(
                        undefined,
                        styles.color,
                        v === s[0]() ? styles.selected : '',
                        this.#disabled.includes(v) ? styles.disabled : ''
                    );

                    return <span class={cls} style={{ 'background': v }} onclick={() => {
                        if (this.#disabled.includes(v)) { return; }
                        s[1](v);
                    }} />;
                }}
            </For>
        </div>;
    }
}
