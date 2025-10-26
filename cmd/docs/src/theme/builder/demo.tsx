// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Accessor, Appbar, BasicTable, Button, Card, Column, DatePanel, Form, FormAccessor,
    Menu, Mode, ObjectAccessor, Password, Scheme, TextField, ThemeProvider, useLocale
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
    // 快速多次地调整 ThemeProvider 参数可能会导致元素消失失败，main 中同时出现在多个元素。
    return <div class="w-full h-full p-2">
        <ThemeProvider mode={props.m.getValue()} scheme={props.s.raw()}>
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

    const regUserAccessor = new FormAccessor({
        username: '',
        password: ''
    }, 0 as any);

    return <div class={styles.components}>
        <BasicTable class="w-full! transition-all" items={items} columns={columns} />

        <DatePanel class="transition-all" value={new Date()} />

        <Card class="transition-all" header='注册用户'
            footerClass='flex justify-between'
            footer={<><Button palette='primary'>重置</Button><Button palette='primary'>注册</Button></>}
        >
            <Form formAccessor={regUserAccessor} layout='vertical'>
                <TextField accessor={regUserAccessor.accessor<string>('username')} label='用户名' placeholder='请输入用户名' />
                <Password accessor={regUserAccessor.accessor<string>('password')} label='密码' placeholder='请输入密码' />
            </Form>
        </Card>

        <Menu class="min-w-50 border border-palette-fg-low rounded-md transition-all" layout='inline' items={[
            { type: 'item', label: 'Item 1', value: '1' },
            { type: 'item', label: 'Item 2', value: '2' },
            { type: 'item', label: 'Item 3', value: '3' },
            { type: 'group', label: 'group', items: [
                { type: 'item', label: 'Item 1', value: '41' },
                { type: 'item', label: 'Item 2', value: '42' },
            ] },
        ]} />
    </div>;
}
