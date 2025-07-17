// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import {
    createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps, untrack
} from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { DateRangePanel, RangeValueType } from '@/datetime';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea } from '@/form/field';
import { IconComponent } from '@/icon';
import { presetProps as basePresetProps, Props as PickerProps } from './date';
import styles from './style.module.css';

export interface Props extends Omit<PickerProps, 'accessor'> {
    /**
     * 中间的箭头
     */
    arrowIcon?: IconComponent;

    accessor: Accessor<RangeValueType | undefined>;
}

const presetProps = {
    ...basePresetProps,
    arrowIcon: IconArrowRight,
} as const;

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
    const ab = anchor.getBoundingClientRect();
    const ret = popElem.togglePopover();
    adjustPopoverPosition(popElem, ab, 2);
    return ret;
}

export function DateRangePicker(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    const [panelProps, _] = splitProps(props,
        ['time', 'weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

    let panelRef: HTMLElement;
    let anchorRef: HTMLElement;

    const [hover, setHover] = createSignal(false);

    const change = (val?: RangeValueType) => {
        props.accessor.setValue(val);
    };

    const formater = createMemo(() => { return props.time ? l.datetime.format : l.date.format; });

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
                value={untrack(props.accessor.getValue)} onChange={change}
            />

            <div class={styles.actions}>
                <div class={styles.left}>
                    <Button kind='flat' class='py-0 px-1' onClick={() => {
                        const now = new Date();
                        if ((props.min && props.min > now) || (props.max && props.max < now)) { return; }
                        props.accessor.setValue(now);
                        panelRef.hidePopover();
                    }}>{l.t(props.time ? '_c.date.now' : '_c.date.today')}</Button>
                </div>

                <div class={styles.right}>
                    <Button kind='flat' class='py-0 px-1' onClick={() => {
                        props.accessor.setValue(undefined);
                        panelRef.hidePopover();
                    }}>{l.t('_c.date.clear')}</Button>

                    <Button kind='flat' class='py-0 px-1' palette={props.accentPalette} onClick={() => {
                        panelRef.hidePopover();
                    }}>{l.t('_c.ok')}</Button>
                </div>
            </div>
        </fieldset>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
