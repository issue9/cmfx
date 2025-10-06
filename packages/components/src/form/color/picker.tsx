// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';

import { joinClass, Layout } from '@/base';
import { calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea, useForm } from '@/form/field';
import OKLCHPanel, { Props as PanelProps, Ref as PanelRef } from './panel';
import styles from './style.module.css';

export interface Props extends PanelProps {
    layout?: Layout;

    rounded?: boolean;

    hasHelp?: boolean;
}

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
    const ab = anchor.getBoundingClientRect();
    const ret = popElem.togglePopover();
    adjustPopoverPosition(popElem, ab, 2);
    return ret;
}

export default function OKLCHPicker(props: Props): JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    let panelRef: PanelRef;
    let anchorRef: HTMLElement;
    const [panelProps, _] = splitProps(props, ['disabled', 'readonly', 'palette', 'accessor', 'wcag', 'presets']);

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    const id = createUniqueId();
    return <Field class={props.class} title={props.title} palette={props.palette} aria-haspopup>
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)}>
            <div ref={el => anchorRef = el}
                onClick={() => togglePop(anchorRef, panelRef.element())}
                class={joinClass(undefined, styles['oklch-activator-block'], props.rounded ? 'rounded-full' : '')}
                style={{
                    'background': props.accessor.getValue(),
                    'color': props.wcag,
                }}
            >
                <Show when={props.wcag}>A</Show>
                <input id={id} onClick={e => e.preventDefault()} type="color" class="hidden"
                    disabled={props.disabled} readOnly={props.readonly} />
            </div>
        </div>

        <OKLCHPanel {...panelProps} ref={el => {
            panelRef = el;
            el.element().popover = 'auto';
        }} />

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
