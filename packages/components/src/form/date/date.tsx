// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass, Palette } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { DatePanel, DatePanelProps } from '@/datetime';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea } from '@/form/field';
import styles from './style.module.css';

export interface Props extends FieldBaseProps, Omit<DatePanelProps, 'onChange' | 'value' | 'popover' | 'ref'> {
    placeholder?: string;

    rounded?: boolean;

    /**
     * 一些突出操作的样式色盘
     */
    accentPalette?: Palette;

    accessor: Accessor<Date | undefined>;
}

export const presetProps: Partial<Props> = {
    accentPalette: 'primary',
    weekBase: 0,
    layout: 'horizontal'
} as const;

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
    const ab = anchor.getBoundingClientRect();
    const ret = popElem.togglePopover();
    adjustPopoverPosition(popElem, ab, 2);
    return ret;
}

export function DatePicker(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'accessor', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

    let panelRef: HTMLElement;
    let anchorRef: HTMLElement;

    const [hover, setHover] = createSignal(false);

    const change = (val?: Date) => {
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
            <input id={id} class={styles.input} tabIndex={props.tabindex}
                disabled={props.disabled} readOnly placeholder={props.placeholder}
                value={props.accessor.getValue() ? formater()(props.accessor.getValue()) : ''}
            />
            <Show when={hover() && props.accessor.getValue()} fallback={<IconExpandAll />}>
                <IconClose onClick={e => {
                    e.stopPropagation();
                    props.accessor.setValue(undefined);
                }} />
            </Show>
        </div>

        <fieldset popover="auto" disabled={props.disabled} ref={el => panelRef = el} class={styles.panel} aria-haspopup>

            <DatePanel class={styles['dt-panel']} {...panelProps} value={props.accessor.getValue()}
                onChange={change} />

            <div class={styles.actions}>
                <div class={styles.left}>
                    <Button onClick={() => {
                        const now = new Date();
                        if ((props.min && props.min > now) || (props.max && props.max < now)) { return; }
                        props.accessor.setValue(now);
                        panelRef.hidePopover();
                    }}>{l.t(props.time ? '_c.date.now' : '_c.date.today')}</Button>
                </div>

                <div class={styles.right}>
                    <Button onClick={() => {
                        props.accessor.setValue(undefined);
                        panelRef.hidePopover();
                    }}>{l.t('_c.date.clear')}</Button>

                    <Button palette={props.accentPalette} onClick={() => {
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
