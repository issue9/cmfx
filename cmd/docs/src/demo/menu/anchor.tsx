// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Menu, MenuItem } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, paletteSelector } from '../base';
import styles from './style.module.css';

function selectedClassSelector(preset?: string) {
    return arraySelector('selected class', [styles.selected, '', undefined], preset);
}

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [selectedClsS, selectedCls] = selectedClassSelector(undefined);
    const [layoutS, layout] = arraySelector('layout', ['horizontal', 'vertical', 'inline'], 'inline');

    const items: Array<MenuItem<string>> = [
        { type: 'a', value: 'v1', label: 'v1', icon: IconFace, disabled: true },
        { type: 'a', value: 'v2', label: 'v2' },
        { type: 'divider' },
        {
            type: 'group', label: 'group', items: [
                { type: 'a', value: 'v22', label: 'v22' },
                { type: 'divider' },
                {
                    type: 'a', value: 'v23', label: 'v23', items: [
                        { type: 'a', value: 'v233', label: 'v233' },
                        {
                            type: 'a', value: 'v234', label: 'v234', items: [
                                { type: 'a', value: 'v2341', label: 'v2341' },
                                { type: 'a', value: 'v2342', label: 'v2342' },
                                { type: 'divider' },
                                { type: 'a', value: 'v2343', label: 'v2343' },
                            ]
                        },
                    ]
                },
            ]
        },
        { type: 'item', value: 'v3', label: 'v3(control+c)' },
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
        {layoutS}

        <Menu layout={layout()} selectedClass={selectedCls()} palette={palette()} items={items} />
    </div>;
}
