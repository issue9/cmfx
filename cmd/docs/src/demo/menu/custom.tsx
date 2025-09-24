// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dropdown, DropdownRef, MenuItem } from '@cmfx/components';
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
        { type: 'item', value: 'v1', label: 'v1', prefix: <IconFace />, disabled: true },
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
        { type: 'item', value: 'v3', label: 'v3' },
        {
            type: 'item', value: 'v4', label: '很长很长很长的标题-v4', prefix: <IconFace />, items: [
                { type: 'item', value: 'v41', label: 'v41' },
                { type: 'divider' },
                {
                    type: 'item', value: 'v42', label: 'v42', prefix: <IconFace />, items: [
                        { type: 'item', value: 'v421', label: '很长很长很长的标题-v421' },
                        { type: 'item', value: 'v422', label: 'v422' },
                        { type: 'divider' },
                        { type: 'item', value: 'v423', label: 'v423' },
                    ]
                },
            ]
        },
    ];

    let ref: DropdownRef;

    return <div>
        {paletteS}
        {selectedClsS}
        <Button onClick={() => ref.show()}>show</Button>
        <Button onClick={() => ref.hide()}>hide</Button>
        <br />
        <Dropdown selectedClass={selectedCls()} palette={palette()} ref={el => ref = el}
            items={items} trigger='custom' onPopover={e => console.log('visible:', e)}>
            <div class="bg-primary-bg text-primary-fg w-full h-full">custom</div>
        </Dropdown>
    </div>;
}
