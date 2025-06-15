// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop } from '@cmfx/core';
import { JSX, onCleanup, onMount, splitProps } from 'solid-js';

import { joinClass, Layout } from '@/base';
import { calcLayoutFieldAreas, Field } from '@/form/field';
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

    return <Field ref={(el) => fieldRef = el} class={joinClass(props.class, styles['oklch-activator'])}
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
            onClick={() => togglePop(anchorRef, panelRef)}
            style={{ 'background': props.accessor.getValue() }}
            classList={{
                [styles['oklch-activator-block']]: true,
                'rounded-full': props.rounded
            }}
        />

        <OKLCHPanel class="fixed" popover="manual" ref={el => panelRef = el} {...panelProps} />
    </Field>;
}
