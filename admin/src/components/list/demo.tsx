// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Palette } from '@/components/base';
import { PaletteSelector } from '@/components/base/demo';
import { Divider } from '@/components/divider';
import { default as Item } from './item';
import { default as List } from './list';

export default function() {
    const [palette, setPalette] = createSignal<Palette>();

    return <div class="flex flex-col gap-2">
        <PaletteSelector get={palette} set={setPalette} />

        <List palette={palette()}>
            <Item text="item" head='face'>
                <Item text="current" head='face' to="/demo/list" />
                <Divider />
                <Item text="item2" />
                <Item text="item3" />
            </Item>
            <Divider />
            <Item text="errors" head='face' to="/demo/errors" />
            <Item text="item2" head='face' />
            <Item text="level 1" head='face'>
                <Item text="level 2">
                    <Item text="level 3" />
                </Item>
            </Item>
        </List>
    </div>;
}
