// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';

import { presetProps, default as Panel, Props as PanelProps } from './panel';
import { useApp } from '@/app/context';

export interface Props extends PanelProps {
    placeholder?: string;

    rounded?: boolean;

    // TODO min, max, range
}

function togglePop(anchor: Element, pop: HTMLElement): boolean {
    // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
    const ab = anchor.getBoundingClientRect();
    pop.style.marginTop = '2px';
    pop.style.minWidth = ab.width + 'px';
    pop.style.width = ab.width + 'px';
    pop.style.top = ab.bottom + 'px';
    pop.style.left = ab.left + 'px';

    return pop.togglePopover();
}

export default function(props: Props) {
    const ctx = useApp();

    props = mergeProps(presetProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'accessor', 'weekend', 'disabled', 'readonly', 'palette']);

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

    const activator = <div accessKey={props.accessKey}
        classList={{
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
                <span class="c--icon tail">expand_all</span>
            </div>
        </label>
        <Show when={ac.hasError()}>
            <p class="field_error" role="alert">{ac.getError()}</p>
        </Show>
    </div>;

    return <>
        {activator}
        <Panel class="fixed" popover="manual" ref={el=>panelRef=el} {...panelProps}></Panel>
    </>;
}
