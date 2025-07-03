// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { joinClass } from '@/base';
import { DatePanel, fieldAccessor } from '@/form';
import { BasicTable, Column } from '@/table';
import styles from './style.module.css';

// 展示的组件
export function Components(): JSX.Element {
    const dateAccess = fieldAccessor('date', Date(), false);

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
            <DatePanel accessor={dateAccess} />
        </div>
    </div>;
}
