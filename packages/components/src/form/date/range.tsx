// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import {
    createMemo,
    createUniqueId, JSX, mergeProps, onCleanup, onMount, Show, splitProps
} from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';

import { joinClass, Palette } from '@/base';
import { useLocale } from '@/context';
import { DateRangePanel, RangeValueType } from '@/datetime';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea } from '@/form/field';
import { IconComponent } from '@/icon';
import { Props as PickerProps } from './date';
import styles from './style.module.css';

export interface Props extends Omit<PickerProps, 'accessor'> {
    /**
     * 中间的箭头
     */
    arrowIcon?: IconComponent;

    /**
     * 一些突出操作的样式色盘
     */
    accentPalette?: Palette;

    accessor: Accessor<RangeValueType | undefined>;
}

const presetProps = {
    accentPalette: 'primary',
    arrowIcon: IconArrowRight,
    layout: 'horizontal',
    weekBase: 0,
} as const;

export function DateRangePicker(props: Props): JSX.Element {
    const l = useLocale();

    props = mergeProps(presetProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

    let fieldRef: HTMLElement;
    let popRef: HTMLElement;

    const handleClick = (e: MouseEvent) => {
        if (!fieldRef.contains(e.target as Node)) { popRef.hidePopover(); }
    };
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { popRef.hidePopover(); }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeydown);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeydown);
    });

    const showPopover = (e: {target: HTMLInputElement}) => {
        popRef.hidePopover();
        const ab = e.target.getBoundingClientRect();
        adjustPopoverPosition(popRef, ab, 8);
        popRef.showPopover();
    };

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.accessor.hasHelp(), !!props.label));
    return <Field ref={(el) => fieldRef = el} class={joinClass(props.class, styles.activator)}
        title={props.title} palette={props.palette} aria-haspopup
    >
        <Show when={areas().labelArea}>
            {area => <label for={id} style={fieldArea2Style(area())}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} classList={{
            [styles['activator-container']]: true,
            [styles.rounded]: props.rounded
        }}>
            <input id={id} readOnly disabled={props.disabled} placeholder={props.placeholder}
                class={joinClass(styles.input, styles.range)}
                value={props.time ? l.datetime.format(ac1.getValue()) : l.date.format(ac1.getValue())}
            />
            {props.arrowIcon!({ class: 'px-1 shrink-0' })}
            <input readOnly disabled={props.disabled} placeholder={props.placeholder}
                class={joinClass(styles.input, styles.range)}
                value={props.time ? l.datetime.format(ac2.getValue()) : l.date.format(ac2.getValue())}
            />
            <Show when={ac1.getValue() || ac2.getValue()}>
                <IconClose class="shrink-0" tabIndex={props.tabindex} onClick={() => {
                    ac1.setValue(undefined);
                    ac2.setValue(undefined);
                    props.accessor.setValue([undefined, undefined]);
                }} />
            </Show>

            <DateRangePanel popover="manual" ref={el => popRef = el} accessor={panelVal} {...panelProps} />
        </div>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
