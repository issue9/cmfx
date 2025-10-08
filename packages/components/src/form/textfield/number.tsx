// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/arrow-drop-down';
import IconArrowUp from '~icons/material-symbols/arrow-drop-up';

import { PropsError } from '@/base';
import { Button } from '@/button';
import styles from './style.module.css';
import { Ref, TextField, Props as TextFieldProps } from './textfield';

type omitFields = 'suffix' | 'type' | 'ref' | 'autocomplete' | 'inputMode';
export interface Props extends Omit<TextFieldProps<number | undefined>, omitFields> {
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
    const [_, fieldProps] = splitProps(props, ['min', 'max', 'step']);

    if (props.step === 0) {
        throw new PropsError('step', '不能为零');
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

    let ref: Ref;

    const wheel = (e: WheelEvent)=>{
        e.preventDefault();
        const stepV = props.step ?? 1;
        step(e.deltaY > 0 ? stepV : -stepV);
    };

    onMount(()=>{
        ref.input().addEventListener('wheel', wheel);
    });

    onCleanup(()=>{
        ref.input().removeEventListener('wheel', wheel);
    });

    return <TextField ref={el => ref = el} {...fieldProps} type="number" suffix={
        <>
            <Button kind='flat' class={styles['number-spin']} disabled={props.disabled || props.readonly}
                onclick={() => step(props.step!)}>
                <IconArrowUp />
            </Button>
            <Button kind='flat' class={styles['number-spin']} disabled={props.disabled || props.readonly}
                onclick={() => step(-props.step!)}>
                <IconArrowDown />
            </Button>
        </>
    } />;
}
