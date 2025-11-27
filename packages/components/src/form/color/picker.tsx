// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';

import { joinClass } from '@/base';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm } from '@/form/field';
import { ColorPanel, ColorPanelProps } from '@/color';
import { Dialog, DialogRef } from '@/dialog';
import styles from './style.module.css';

export interface Props extends Omit<ColorPanelProps, 'value' | 'onChange'>, FieldBaseProps {
    accessor: Accessor<string>;
}

export default function ColorPicker(props: Props): JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const [panelProps, _] = splitProps(props, ['palette', 'wcag', 'pickers']);
    let dlgRef: DialogRef;

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    const id = createUniqueId();
    return <Field class={props.class} title={props.title} palette={props.palette} aria-haspopup style={props.style}>
        <Show when={areas().labelArea}>
            {area => <label style={{
                ...fieldArea2Style(area()),
                'width': props.labelWidth,
                'text-align': props.labelAlign,
            }} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)}>
            <div class={joinClass(undefined, styles['color-panel-activator'], props.rounded ? 'rounded-full' : '')}
                onClick={() => dlgRef.element().showModal()}
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

        <Dialog ref={el => dlgRef = el} header={props.label} movable>
            <ColorPanel {...panelProps} onChange={v => props.accessor.setValue(v)} value={props.accessor.getValue()} />
        </Dialog>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
