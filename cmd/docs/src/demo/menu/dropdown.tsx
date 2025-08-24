// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Dropdown, MenuItem } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, paletteSelector } from '../base';
import styles from './style.module.css';

function selectedClassSelector(preset?: string) {
    return arraySelector('selected class', [styles.selected, '', undefined], preset);
}

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [selectedClsS, selectedCls] = selectedClassSelector(undefined);

    const items: Array<MenuItem<string>> = [
        { type: 'item', value: 'v1', label: 'v1', icon: IconFace, disabled: true },
        { type: 'item', value: 'v2', label: 'v2' },
        { type: 'divider' },
        {
            type: 'group', label: 'group', items: [
                { type: 'item', value: 'v22', label: 'v22' },
                { type: 'divider' },
                {
                    type: 'item', value: 'v23', label: 'v23', items: [
                        { type: 'item', value: 'v233', label: 'v233' },
                        {
                            type: 'item', value: 'v234', label: 'v234', items: [
                                { type: 'item', value: 'v2341', label: 'v2341' },
                                { type: 'item', value: 'v2342', label: 'v2342' },
                                { type: 'divider' },
                                { type: 'item', value: 'v2343', label: 'v2343' },
                            ]
                        },
                    ]
                },
            ]
        },
        { type: 'item', value: 'v3', label: 'v3(control+q)', hotkey: new Hotkey('q', 'control') },
        {
            type: 'item', value: 'v4', label: '很长很长很长的标题-v4', icon: IconFace, items: [
                { type: 'item', value: 'v41', label: 'v41' },
                { type: 'divider' },
                {
                    type: 'item', value: 'v42', label: 'v42', icon: IconFace, items: [
                        { type: 'item', value: 'v421', label: '很长很长很长的标题-v421' },
                        { type: 'item', value: 'v422', label: 'v422' },
                        { type: 'divider' },
                        { type: 'item', value: 'v423', label: 'v423' },
                    ]
                },
            ]
        },
    ];

    return <div>
        {paletteS}
        {selectedClsS}
        <Dropdown selectedClass={selectedCls()} palette={palette()} items={items} hoverable>dropdown</Dropdown>
    </div>;
}
