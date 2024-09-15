// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { mergeProps, Show, splitProps } from 'solid-js';

import { defaultProps, default as Panel, Props as PanelProps } from './panel';
import { formatDate } from './utils';

export interface Props extends PanelProps {
    placeholder?: string;

    rounded?: boolean;

    // TODO min, max, range
}

function togglePop(anchor: Element, pop: HTMLElement): boolean {
    // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
    const ab = anchor.getBoundingClientRect();
    pop.style.minWidth = ab.width + 'px';
    pop.style.width = ab.width + 'px';
    pop.style.top = ab.bottom + 'px';
    pop.style.left = ab.left + 'px';

    const ret = pop.togglePopover(); // 必须要先显示，后面的调整大小才有效果。
    return ret;
}

export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'accessor', 'weekend', 'disabled', 'readonly', 'palette']);

    const ac = props.accessor;
    let panelRef: HTMLElement;
    let labelRef: HTMLLabelElement;

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
                    { formatDate(new Date(ac.getValue()), props.time) }
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
