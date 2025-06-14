// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop } from '@cmfx/core';
import { createSignal, JSX, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { classList, Layout } from '@/base';
import { useLocale } from '@/context';
import { calcLayoutFieldAreas, Field } from '@/form/field';
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
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'accessor', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

    const ac = props.accessor;
    let panelRef: HTMLElement;
    let fieldRef: HTMLElement;
    let anchorRef: HTMLElement;

    const handleClick = (e: MouseEvent) => {
        if (!fieldRef.contains(e.target as Node)) {
            panelRef.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    const [hover, setHover] = createSignal(false);
    const close = () => { props.accessor.setValue(undefined); };

    return <Field ref={(el) => fieldRef = el} class={classList(props.classList, props.class, styles.activator)}
        {...calcLayoutFieldAreas(props.layout!)}
        help={props.help}
        hasHelp={props.accessor.hasHelp}
        getError={props.accessor.getError}
        title={props.title}
        label={<label onClick={() => togglePop(anchorRef, panelRef)}>{props.label}</label>}
        palette={props.palette}
        aria-haspopup
    >
        <div ref={el => anchorRef = el}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => togglePop(anchorRef, panelRef)}
            classList={{
                [styles['activator-container']]: true,
                [styles.rounded]: props.rounded
            }}
        >
            <input class={styles.input} tabIndex={props.tabindex} disabled={props.disabled} readOnly placeholder={props.placeholder} value={
                props.time ? l.datetime(ac.getValue()) : l.date(ac.getValue())
            } />
            <Show when={hover() && ac.getValue()} fallback={<IconClose onClick={close} />}>
                <IconExpandAll onClick={close} />
            </Show>
        </div>

        <DatePanel class={styles.fixed} popover="manual" ref={el => panelRef = el} {...panelProps}
            ok={() => panelRef.hidePopover()}
            clear={() => panelRef.hidePopover()}
        />
    </Field>;
}
