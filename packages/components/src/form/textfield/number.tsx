// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show, splitProps } from 'solid-js';

import { Button } from '@components/button';
import { Icon, IconSymbol } from '@components/icon';
import { Props as BaseProps, TextField } from './textfiled';

export interface Props extends Omit<BaseProps<number|undefined>, 'prefix'|'suffix'|'type'|'ref'|'autocomplete'|'aria-autocomplete'|'inputMode'> {
    icon?: IconSymbol;
    min?: number;
    max?: number;
    step?: number;
    inputMode?: 'decimal' | 'numeric';
}

const presetProps: Partial<Props> = {
    step: 1,
    inputMode: 'decimal'
};

/**
 * 数字输入组件
 */
export function Number(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [_, fieldProps] = splitProps(props, ['icon','min','max','step']);

    if (props.step === 0) {
        throw 'step 不能为零';
    }

    const access = props.accessor;

    const step = (v: number) => {
        if (props.readonly || props.disabled) {
            return;
        }

        const n = (access.getValue() ?? 0) + v;
        if (props.min !== undefined && v < 0 && n < props.min) {
            return;
        }
        if (props.max !== undefined && v > 0 && n > props.max) {
            return;
        }

        access.setValue((access.getValue() ?? 0) + v);
        access.setError();
    };

    return <TextField {...fieldProps} type="number" prefix={
        <Show when={props.icon}>
            <Icon icon={props.icon!} class="px-1 !py-0 !flex !items-center" />
        </Show>
    } suffix={
        <>
            <Button type='button' kind='flat' class="!px-1 !py-0 rounded-none" icon disabled={props.disabled} onClick={()=>step(props.step!)}>arrow_drop_up</Button>
            <Button type='button' kind='flat' class="!px-1 !py-0 rounded-none" icon disabled={props.disabled} onClick={()=>step(-props.step!)}>arrow_drop_down</Button>
        </>
    } />;
}
