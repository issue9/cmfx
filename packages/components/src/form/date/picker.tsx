// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass, Palette } from '@/base';
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

    /**
     * 如果是字符串，表示一个能被 {@link Date.parse} 识别的日期格式，
     * 如果是 number，则表示微秒。
     */
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

    const ac = props.accessor;
    const [hover, setHover] = createSignal(false);

    const change = (val?: Date) => {
        props.accessor.setValue(val);
    };

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.accessor.hasHelp(), !!props.label));
    return <Field class={joinClass(styles.activator, props.class)} title={props.title} palette={props.palette} aria-haspopup>
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} ref={el => anchorRef = el}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            onClick={() => togglePop(anchorRef, panelRef)}
            classList={{
                [styles['activator-container']]: true,
                [styles.rounded]: props.rounded
            }}
        >
            <input id={id} class={styles.input} tabIndex={props.tabindex} disabled={props.disabled} readOnly placeholder={props.placeholder} value={
                props.time ? l.datetime.format(ac.getValue()) : l.date.format(ac.getValue())
            } />
            <Show when={hover() && ac.getValue()} fallback={<IconExpandAll />}>
                <IconClose onClick={e => {
                    e.stopPropagation();
                    ac.setValue(undefined);
                }} />
            </Show>
        </div>

        <fieldset popover="auto" disabled={props.disabled} ref={el => panelRef = el} class={styles.panel}>

            <DatePanel class={styles['dt-panel']} {...panelProps} onChange={change} tabindex={props.tabindex}
                value={props.accessor.getValue()} />

            <div class={styles.actions}>
                <div class={styles.left}>
                    <button tabIndex={props.tabindex} onClick={() => {
                        const now = new Date();
                        if ((props.min && props.min > now) || (props.max && props.max < now)) { return; }
                        change(now);
                        panelRef.hidePopover();
                    }}>{l.t(props.time ? '_c.date.now' : '_c.date.today')}</button>
                </div>

                <div class={styles.right}>
                    <button tabIndex={props.tabindex} onClick={() => {
                        props.accessor.setValue(undefined);
                        panelRef.hidePopover();
                    }}>{l.t('_c.date.clear')}</button>

                    <button tabIndex={props.tabindex} classList={{ [`palette--${props.accentPalette}`]: !!props.accentPalette }} onClick={() => {
                        panelRef.hidePopover();
                    }}>{l.t('_c.ok')}</button>
                </div>
            </div>
        </fieldset>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
