// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop } from '@cmfx/core';
import { createSignal, JSX, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';

import { useLocale } from '@/context';
import { Accessor, calcLayoutFieldAreas, Field, FieldAccessor } from '@/form/field';
import { IconComponent } from '@/icon';
import { DatePanel, presetProps as presetPickerProps, ValueType } from './panel';
import { Props as PickerProps } from './picker';

export interface Props extends Omit<PickerProps, 'accessor'> {
    accessor: Accessor<[ValueType, ValueType]>;

    /**
     * 中间的箭头
     */
    arrowIcon?: IconComponent;
}

const presetProps = {
    ...presetPickerProps,
    arrowIcon: IconArrowRight
} as const;

export function DateRangePicker(props: Props): JSX.Element {
    const l = useLocale();

    props = mergeProps(presetProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

    const [min, setMin] = createSignal(props.min);
    const [max, setMax] = createSignal(props.max);

    const ac = props.accessor;
    const ac1 = FieldAccessor('start', ac.getValue()[0]);
    const ac2 = FieldAccessor('end', ac.getValue()[1]);
    let curr = ac1;
    const panelVal = FieldAccessor('val', ac1.getValue());

    let fieldRef: HTMLElement;
    let anchorRef: HTMLElement;
    let popRef: HTMLElement;

    const handleClick = (e: MouseEvent) => {
        if (!fieldRef.contains(e.target as Node)) {
            popRef.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    const togglePop = (e: {target: HTMLInputElement}) => {
        popRef.hidePopover();
        const ab = e.target.getBoundingClientRect();
        pop(popRef, ab, 8);
        popRef.showPopover();
    };

    return <Field ref={(el) => fieldRef = el} class={(props.class ?? '') + ' c--date-activator'}
        {...calcLayoutFieldAreas(props.layout!)}
        help={props.help}
        classList={props.classList}
        hasHelp={props.accessor.hasHelp}
        getError={props.accessor.getError}
        title={props.title}
        label={<label onClick={() => anchorRef.click()}>{props.label}</label>}
        palette={props.palette}
        aria-haspopup
    >
        <div ref={el => anchorRef = el}
            classList={{
                'c--date-activator-container': true,
                'rounded': props.rounded
            }}
        >
            <input tabIndex={props.tabindex} class="input range" disabled={props.disabled} readOnly placeholder={props.placeholder} value={
                props.time ? l.datetime(ac1.getValue()) : l.date(ac1.getValue())
            } onFocus={(e)=>{
                togglePop(e);

                setMin(props.min);
                const ac2V = ac2.getValue();
                setMax(ac2V ? new Date(ac2V) : props.max);

                curr = ac1;
                panelVal.setValue(ac1.getValue());
            }} />
            {props.arrowIcon!({class:'px-1 shrink-0'})}
            <input tabIndex={props.tabindex} class="input range" disabled={props.disabled} readOnly placeholder={props.placeholder} value={
                props.time ? l.datetime(ac2.getValue()) : l.date(ac2.getValue())
            } onFocus={(e)=>{
                togglePop(e);

                setMax(props.max);
                const ac1V = ac1.getValue();
                setMin(ac1V ? new Date(ac1V) : props.min);

                curr = ac2;
                panelVal.setValue(ac2.getValue());
            }} />
            <Show when={ac1.getValue() || ac2.getValue()}>
                <IconClose class="shrink-0" tabIndex={props.tabindex} onClick={() => {
                    ac1.setValue(undefined);
                    ac2.setValue(undefined);
                    props.accessor.setValue([undefined, undefined]);
                }} />
            </Show>
        </div>

        <DatePanel popover="manual" min={min()} max={max()} ref={el=>popRef=el} accessor={panelVal} {...panelProps}
            ok={() => {
                curr.setValue(panelVal.getValue());
                popRef.hidePopover();
            }}
            clear={() => {
                curr.setValue(panelVal.getValue());
                popRef.hidePopover();
            }}
        />
    </Field>;
}
