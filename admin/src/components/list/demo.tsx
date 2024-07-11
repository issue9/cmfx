// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Color } from '@/components/base';
import { SchemeSelector } from '@/components/base/demo';
import { XDivider } from '@/components/divider';
import { default as XItem } from './item';
import { default as XList } from './list';

export default function() {
    const [c, setC] = createSignal<Color>();

    return <div class="flex flex-col gap-2">
        <SchemeSelector get={c} set={setC} />

        <XList color={c()}>
            <XItem text="item" head='face'>
                <XItem text="current" head='face' to="/demo/list" />
                <XDivider />
                <XItem text="item2" />
                <XItem text="item3" />
            </XItem>
            <XDivider />
            <XItem text="errors" head='face' to="/demo/errors" />
            <XItem text="item2" head='face' />
            <XItem text="level 1" head='face'>
                <XItem text="level 2">
                    <XItem text="level 3" />
                </XItem>
            </XItem>
        </XList>
    </div>;
}
