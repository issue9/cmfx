// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { DateRangePanel, RangeValueType } from '@/datetime';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea, useFormContext } from '@/form/field';
import { IconComponent } from '@/icon';
import { presetProps as basePresetProps, Props as PickerProps } from './date';
import styles from './style.module.css';
import { togglePop } from './utils';

export interface Props extends Omit<PickerProps, 'accessor'> {
    /**
     * 中间的箭头
     */
    arrowIcon?: IconComponent;

    accessor: Accessor<RangeValueType | undefined>;

    /**
     * 是否显示右侧快捷选择栏
     */
    shortcuts?: boolean;
}

const presetProps = {
    ...basePresetProps,
    arrowIcon: IconArrowRight,
} as const;

export function DateRangePicker(props: Props): JSX.Element {
    const form = useFormContext();
    props = mergeProps(presetProps, form, props);
    const l = useLocale();

    const [panelProps, _] = splitProps(props,
        ['time', 'weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max', 'shortcuts']);

    let panelRef: HTMLElement;
    let anchorRef: HTMLElement;

    const [hover, setHover] = createSignal(false);

    const change = (val?: RangeValueType) => {
        props.accessor.setValue(val);
    };

    const formater = createMemo(() => {
        return props.time ? l.datetimeFormat().format : l.dateFormat().format;
    });

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.accessor.hasHelp(), !!props.label));
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
                value={formater()(props.accessor.getValue()![0])}
            />
            {props.arrowIcon!({ class: 'px-1 shrink-0' })}
            <input readOnly disabled={props.disabled} placeholder={props.placeholder}
                class={joinClass(styles.input, styles.range)}
                value={formater()(props.accessor.getValue()![1])}
            />

            <Show when={hover() && props.accessor.getValue()} fallback={<IconExpandAll class="shrink-0" />}>
                <IconClose class="shrink-0" onClick={e => {
                    e.stopPropagation();
                    props.accessor.setValue(undefined);
                }} />
            </Show>
        </div>

        <fieldset popover="auto" disabled={props.disabled} ref={el => panelRef = el} class={styles.panel} aria-haspopup>

            <DateRangePanel class={styles['dt-panel']} {...panelProps}
                value={props.accessor.getValue()} onChange={change}
            />

            <div class={joinClass(styles.actions, '!justify-end')}>
                <Button kind='flat' class='py-0 px-1' onClick={() => {
                    props.accessor.setValue([undefined, undefined]);
                    panelRef.hidePopover();
                }}>{l.t('_c.date.clear')}</Button>

                <Button kind='flat' class='py-0 px-1' onClick={() => {
                    props.accessor.reset();
                    panelRef.hidePopover();
                }}>{l.t('_c.reset')}</Button>
            </div>
        </fieldset>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
