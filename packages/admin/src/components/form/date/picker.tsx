// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { useApp } from '@admin/components/context';
import { Field } from '@admin/components/form/field';
import { Icon } from '@admin/components/icon';
import { calcPopoverPos } from '@admin/components/utils';
import { DatePanel, Props as PanelProps, presetProps } from './panel';

export interface Props extends PanelProps {
    placeholder?: string;

    rounded?: boolean;

    min?: Date;

    max?: Date;
}

function togglePop(anchor: Element, pop: HTMLElement): boolean {
    const ab = anchor.getBoundingClientRect();
    const ret = pop.togglePopover();
    calcPopoverPos(pop, ab, '2px');
    return ret;
}

export function DatePicker(props: Props): JSX.Element {
    const ctx = useApp();

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

    return <Field ref={(el) => fieldRef = el} class={(props.class ?? '') + ' c--date-activator'}
        inputArea={{ pos: 'middle-center' }}
        helpArea={{ pos: 'bottom-center' }}
        help={props.help}
        labelArea={{ pos: props.horizontal ? 'middle-left' : 'top-center' }}
        classList={props.classList}
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
                'c--date-activator-container': true,
                'rounded': props.rounded
            }}
        >
            <input class="input" tabIndex={props.tabindex} disabled={props.disabled} readOnly placeholder={props.placeholder} value={
                props.time ? ctx.locale().datetime(ac.getValue()) : ctx.locale().date(ac.getValue())
            } />
            <Icon icon={hover() && ac.getValue() ? 'close' : 'expand_all'} onClick={() => {
                props.accessor.setValue(undefined);
            }} />
        </div>

        <DatePanel class="fixed" popover="manual" ref={el => panelRef = el} {...panelProps}
            ok={() => panelRef.hidePopover()}
            clear={() => panelRef.hidePopover()}
        />
    </Field>;
}
