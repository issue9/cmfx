// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Accessor, Appbar, BasicTable, Column, DatePanel, joinClass, Mode, ObjectAccessor, Scheme, ThemeProvider, useLocale
} from '@cmfx/components';
import { ExpandType } from '@cmfx/core';
import { JSX } from 'solid-js';

import styles from './style.module.css';

/**
 * 组件演示
 */
export function Demo(props: { m: Accessor<Mode>, s: ObjectAccessor<ExpandType<Scheme>> }): JSX.Element {
    const l = useLocale();

    // NOTE: 此处的 ThemeProvider 必须包含在 div 中，否则当处于 Transition 元素中时，
    // 快速多次地调整 ThemeProvider 参数可能会导致元素消失失败，出现 main 中同时出现在多个元素。
    return <div class="w-full h-full p-2">
        <ThemeProvider mode={props.m.getValue()} scheme={props.s.object()}>
            <div class={styles.demo}>
                <Appbar title={l.t('_d.theme.componentsDemo')} />
                <Components />
            </div>
        </ThemeProvider>
    </div>;
}

function Components(): JSX.Element {
    const items = [
        { id: 1, name: 'name1', address: 'address1' },
        { id: 3, name: 'name3', address: '这是一行很长的数据，这是一行很长的数据，这是一行很长的数据，这是一行很长的数据。' },
        { id: 2, name: 'name2', address: 'address2' },
    ];
    const columns: Array<Column<typeof items[number]>> = [
        { id: 'id' },
        { id: 'name' },
        { id: 'address' },
        { id: 'action', renderLabel: 'ACTIONS', renderContent: () => { return <button>...</button>; }, isUnexported: true }
    ];

    return <div class={styles.components}>
        <div class={joinClass(styles.item, '!w-full')}>
            <BasicTable items={items} columns={columns} />
        </div>

        <div class={styles.item}>
            <DatePanel value={new Date()} />
        </div>
    </div>;
}
