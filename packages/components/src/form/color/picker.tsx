// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop } from '@cmfx/core';
import { JSX, onCleanup, onMount, splitProps } from 'solid-js';

import { Layout } from '@/base';
import { Field } from '@/form/field';
import OKLCHPanel, { Props as PanelProps } from './panel';

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

    return <Field ref={(el) => fieldRef = el} class={(props.class ?? '') + ' c--oklch-activator'}
        inputArea={{ pos: 'middle-center' }}
        helpArea={{ pos: 'bottom-center' }}
        help={props.help}
        labelArea={{ pos: props.layout === 'horizontal' ? 'middle-left' : 'top-center' }}
        classList={props.classList}
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
                'c--oklch-activator-block': true,
                'rounded-full': props.rounded
            }}
        />

        <OKLCHPanel class="fixed" popover="manual" ref={el => panelRef = el} {...panelProps} />
    </Field>;
}
