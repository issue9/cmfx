// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ParentProps, splitProps } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import { AvailableEnumType, RefProps } from '@/base';
import { Button, ButtonGroup, ButtonRef } from '@/button';
import { Dropdown, DropdownProps, DropdownRef } from '@/menu/dropdown';

export interface Ref extends DropdownRef {
    /**
     * 默认操作的元素
     */
    preset(): ButtonRef;
}

export interface Props<M extends boolean = false, T extends AvailableEnumType = string>
    extends Omit<DropdownProps<M, T>, 'trigger' | 'ref'>, RefProps<Ref>, ParentProps {
}

export default function Split<M extends boolean = false, T extends AvailableEnumType = string>(
    props: Props<M, T>
) {
    let dropdownRef: DropdownRef;

    const [, dropProps] = splitProps(props, ['children', 'ref']);
    return <Dropdown ref={el => dropdownRef = el} {...dropProps} trigger='custom'>
        <ButtonGroup>
            {props.children}
            <Button square onclick={()=>{
                dropdownRef.toggle();
            }}><IconArrowDown /></Button>
        </ButtonGroup>
    </Dropdown>;
}
