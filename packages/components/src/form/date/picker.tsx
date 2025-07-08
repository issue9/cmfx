// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop } from '@cmfx/core';
import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass, Layout } from '@/base';
import { useLocale } from '@/context';
import { calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea } from '@/form/field';
import { DatePanel, Props as PanelProps, presetProps as prsetBaseProps } from './panel';
import styles from './style.module.css';

export interface Props extends PanelProps {
    layout?: Layout;

    placeholder?: string;

    rounded?: boolean;

    min?: Date;

    max?: Date;
}

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
    const ab = anchor.getBoundingClientRect();
    const ret = popElem.togglePopover();
    pop(popElem, ab, 2);
    return ret;
}

const presetProps: Partial<Props> = {
    ...prsetBaseProps,
    layout: 'horizontal' as Layout
} as const;

export function DatePicker(props: Props): JSX.Element {
    const l = useLocale();

    props = mergeProps(presetProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'accessor', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max', 'actions']);

    const ac = props.accessor;
    let panelRef: HTMLElement;
    let anchorRef: HTMLElement;

    const [hover, setHover] = createSignal(false);
    const close = () => { props.accessor.setValue(undefined); };

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.accessor.hasHelp(), !!props.label));
    return <Field class={joinClass(props.class, styles.activator)} title={props.title} palette={props.palette} aria-haspopup>
        <Show when={areas().labelArea}>
            {(area)=><label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} ref={el => anchorRef = el}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => togglePop(anchorRef, panelRef)}
            classList={{
                [styles['activator-container']]: true,
                [styles.rounded]: props.rounded
            }}
        >
            <input id={id} class={styles.input} tabIndex={props.tabindex} disabled={props.disabled} readOnly placeholder={props.placeholder} value={
                props.time ? l.datetime(ac.getValue()) : l.date(ac.getValue())
            } />
            <Show when={hover() && ac.getValue()} fallback={<IconClose onClick={close} />}>
                <IconExpandAll onClick={close} />
            </Show>
        </div>

        <DatePanel class={styles.fixed} popover="auto" ref={el => panelRef = el} {...panelProps}
            ok={() => panelRef.hidePopover()}
            clear={() => panelRef.hidePopover()}
        />

        <Show when={areas().helpArea}>
            {(area) => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
