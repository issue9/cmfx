// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps, untrack } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass } from '@/base';
import { WeekPanel } from '@/datetime';
import { WeekValueType } from '@/datetime/dateview';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea } from '@/form/field';
import { Props as PickerProps, presetProps } from './date';
import styles from './style.module.css';
import { togglePop } from './utils';

export interface Props extends Omit<PickerProps, 'accessor' | 'accentPalette' | 'time'> {
    accessor: Accessor<WeekValueType | undefined>;
}

/**
 * 周数选择组件
 */
export function WeekPicker(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const [panelProps, _] = splitProps(props,
        ['weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

    let panelRef: HTMLElement;
    let anchorRef: HTMLElement;

    const [hover, setHover] = createSignal(false);

    const change = (val?: WeekValueType) => {
        props.accessor.setValue(val);
        panelRef.hidePopover();
    };

    const format = (val: WeekValueType) => { return val ? `${val[0]}-${val[1]}` : ''; };

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    return <Field class={joinClass(styles.activator, props.class)}
        title={props.title} palette={props.palette} aria-haspopup
    >
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} ref={el => anchorRef = el}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            onClick={() => togglePop(anchorRef, panelRef)}
            class={joinClass(styles['activator-container'], props.rounded ? styles.rounded : undefined)}
        >
            <input id={id} readOnly disabled={props.disabled} placeholder={props.placeholder}
                class={joinClass(styles.input, styles.range)}
                value={format(props.accessor.getValue()!)}
            />

            <Show when={hover() && props.accessor.getValue()} fallback={<IconExpandAll class="shrink-0" />}>
                <IconClose class="shrink-0" onClick={e => {
                    e.stopPropagation();
                    props.accessor.setValue(undefined);
                }} />
            </Show>
        </div>

        <WeekPanel {...panelProps} ref={el => panelRef = el}
            popover="auto" disabled={props.disabled} aria-haspopup
            value={untrack(props.accessor.getValue)} onChange={change}
        />

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
