// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';

import { useApp } from '@/components/context';
import { Icon } from '@/components/icon';
import { calcPopoverPos } from '@/components/utils';
import { DatePanel, Props as PanelProps, presetProps } from './panel';

export interface Props extends PanelProps {
    placeholder?: string;

    rounded?: boolean;

    min?: Date;

    max?: Date;

    // TODO range
}

function togglePop(anchor: Element, pop: HTMLElement): boolean {
    const ab = anchor.getBoundingClientRect();
    pop.style.marginTop = '2px';
    pop.style.minWidth = ab.width + 'px';
    pop.style.width = ab.width + 'px';

    const ret = pop.togglePopover();
    calcPopoverPos(pop, ab, '2px');

    return ret;
}

export function DatePicker(props: Props): JSX.Element {
    const ctx = useApp();

    props = mergeProps(presetProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'accessor', 'weekend', 'disabled', 'readonly', 'palette', 'class', 'classList', 'min', 'max']);

    const ac = props.accessor;
    let panelRef: HTMLElement;
    let labelRef: HTMLLabelElement;

    const handleClick = (e: MouseEvent) => {
        if (!panelRef.contains(e.target as Node) && !labelRef.contains(e.target as Node)) {
            panelRef.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    const activator = <div accessKey={props.accessKey} class={props.class}
        classList={{
            ...props.classList,
            'c--field':true,
            'c--date-activator':true,
            [`palette--${props.palette}`]:!!props.palette,
        }}>
        <label ref={el=>labelRef=el} title={props.title} onClick={(e) => {
            e.preventDefault();
            togglePop(labelRef, panelRef);
        }}>
            <Show when={props.label}>{props.label}</Show>
            <div tabIndex={props.tabindex} classList={{
                'activator-container': true,
                'rounded': props.rounded
            }}>
                <input class="hidden peer" disabled={props.disabled} readOnly={props.readonly} />
                <div class="input">
                    { props.time ? ctx.locale().datetime(ac.getValue()) : ctx.locale().date(ac.getValue()) }
                </div>
                <Icon icon="expand_all" />
            </div>
        </label>
        <Show when={ac.hasError()}>
            <p class="field_error" role="alert">{ac.getError()}</p>
        </Show>
    </div>;

    return <>
        {activator}
        <DatePanel class="fixed" popover="manual" ref={el=>panelRef=el} {...panelProps}></DatePanel>
    </>;
}
