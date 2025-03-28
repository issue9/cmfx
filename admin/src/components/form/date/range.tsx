// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';

import { useApp } from '@/components/context';
import { Accessor, Field, FieldAccessor } from '@/components/form/field';
import { Icon, IconSymbol } from '@/components/icon';
import { calcPopoverPos } from '@/components/utils';
import { DatePanel, presetProps as presetPickerProps } from './panel';
import { Props as PickerProps } from './picker';

type ValueType = string | number | undefined;

export interface Props extends Omit<PickerProps, 'accessor'> {
    accessor: Accessor<[ValueType, ValueType]>;

    /**
     * 中间的箭头
     */
    arrowIcon?: IconSymbol;
}

const presetProps = {
    ...presetPickerProps,
    arrowIcon: 'arrow_forward'
} as const;

export function DateRangePicker(props: Props): JSX.Element {
    const ctx = useApp();

    props = mergeProps(presetProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

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

    const togglePop = (e: {target: HTMLInputElement}, pop: HTMLElement) => {
        popRef.hidePopover();
 
        const anchorRef = e.target;
        const ab = anchorRef.getBoundingClientRect();
        calcPopoverPos(pop, ab, '8px');
        popRef.showPopover();
    };

    return <Field ref={(el) => fieldRef = el} class={(props.class ?? '') + ' c--date-activator'}
        inputArea={{ pos: 'middle-center' }}
        helpArea={{ pos: 'bottom-center' }}
        labelArea={{ pos: props.horizontal ? 'middle-left' : 'top-center' }}
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
                props.time ? ctx.locale().datetime(ac1.getValue()) : ctx.locale().date(ac1.getValue())
            } onFocus={(e)=>{
                togglePop(e, popRef);

                curr = ac1;
                panelVal.setValue(ac1.getValue());
            }} />
            <Icon icon='arrow_forward' class="px-1" />
            <input tabIndex={props.tabindex} class="input range" disabled={props.disabled} readOnly placeholder={props.placeholder} value={
                props.time ? ctx.locale().datetime(ac2.getValue()) : ctx.locale().date(ac2.getValue())
            } onFocus={(e)=>{
                togglePop(e, popRef);

                curr = ac2;
                panelVal.setValue(ac2.getValue());
            }} />
            <Show when={ac1.getValue() || ac2.getValue()}>
                <Icon tabIndex={props.tabindex} icon='close' onClick={() => {
                    ac1.setValue(undefined);
                    ac2.setValue(undefined);
                    props.accessor.setValue([undefined, undefined]);
                }} />
            </Show>
        </div>

        <DatePanel popover="manual" ref={el=>popRef=el} accessor={panelVal} {...panelProps}
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
