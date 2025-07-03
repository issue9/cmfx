// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop } from '@cmfx/core';
import { createMemo, createUniqueId, JSX, onCleanup, onMount, Show, splitProps } from 'solid-js';

import { joinClass, Layout } from '@/base';
import { calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea } from '@/form/field';
import OKLCHPanel, { Props as PanelProps } from './panel';
import styles from './style.module.css';

export interface Props extends PanelProps {
    layout?: Layout;

    rounded?: boolean;
}

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
    const ab = anchor.getBoundingClientRect();
    const ret = popElem.togglePopover();
    pop(popElem, ab, 2);
    return ret;
}

export default function OKLCHPicker(props: Props): JSX.Element {
    let fieldRef: HTMLElement;
    let panelRef: HTMLElement;
    let anchorRef: HTMLElement;
    const [panelProps, _] = splitProps(props, ['disabled', 'readonly', 'palette', 'accessor']);

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

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.accessor.hasHelp(), !!props.label));
    const id = createUniqueId();
    return <Field ref={(el) => fieldRef = el} class={joinClass(props.class, styles['oklch-activator'])}
        title={props.title}
        palette={props.palette}
        aria-haspopup
    >
        <Show when={areas().labelArea}>
            {(area)=><label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div ref={el => anchorRef = el}
            onClick={() => togglePop(anchorRef, panelRef)}
            style={{ 'background': props.accessor.getValue(), ...fieldArea2Style(areas().inputArea) }}
            classList={{
                [styles['oklch-activator-block']]: true,
                'rounded-full': props.rounded
            }}
        >
            <input id={id} onClick={e=>e.preventDefault()} type="color" class="hidden" disabled={props.disabled} readOnly={props.readonly} />
        </div>

        <OKLCHPanel class="fixed" popover="manual" ref={el => panelRef = el} {...panelProps} />

        <Show when={areas().helpArea}>
            {(area) => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
