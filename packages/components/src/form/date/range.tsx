// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { DateRangePanel, DateRangeValueType } from '@/datetime';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea, useForm } from '@/form/field';
import { arrayEqual } from '@cmfx/core';
import { presetProps as basePresetProps, DateType, Props as PickerProps } from './date';
import styles from './style.module.css';
import { togglePop } from './utils';

//type RangeValueType = [start: DateType | undefined, end: DateType | undefined];

export interface Props<T extends DateType> extends Omit<PickerProps, 'accessor'> {
    /**
     * 中间的箭头
     */
    arrowIcon?: JSX.Element;

    // 类型约束在泛型 T 上，而不是 accessor 属性，可以保证 Accessor 的 start 和 end 是同一类型的。
    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<[start: T | undefined, end: T | undefined] | undefined, 'number' | 'string' | 'date'>;

    /**
     * 是否显示右侧快捷选择栏
     */
    shortcuts?: boolean;
}

export function DateRangePicker<T extends DateType>(props: Props<T>): JSX.Element {
    const form = useForm();
    props = mergeProps({
        ...basePresetProps,
        arrowIcon: <IconArrowRight />,
    }, form, props);
    const l = useLocale();

    const [panelProps, _] = splitProps(props,
        ['time', 'weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max', 'shortcuts']);

    let panelRef: HTMLElement;
    let anchorRef: HTMLElement;

    const [hover, setHover] = createSignal(false);

    const formater = createMemo(() => {
        return props.time ? l.datetimeFormat().format : l.dateFormat().format;
    });

    const getValue = (): DateRangeValueType | undefined => {
        const v = props.accessor.getValue();
        if (v === undefined) { return undefined; }
        if (arrayEqual(v, [undefined, undefined])) { return [undefined, undefined]; }

        switch (props.accessor.kind()) {
        case 'string':
            return [v[0] === undefined ? undefined : new Date(v[0]), v[1] === undefined ? undefined : new Date(v[1])];
        case 'number':
            return [v[0] === undefined ? undefined : new Date(v[0]), v[1] === undefined ? undefined : new Date(v[1])];
        default:
            return v as DateRangeValueType;
        }
    };

    const change = (val?: DateRangeValueType) => {
        if (val === undefined || arrayEqual(val, [undefined, undefined])) {
            props.accessor.setValue(val as any);
            return;
        }

        switch (props.accessor.kind()) {
        case 'string':
            props.accessor.setValue([
                val[0] === undefined ? undefined : val[0].toISOString() as any,
                val[1] === undefined ? undefined : val[1].toISOString() as any
            ]);
            return;
        case 'number':
            props.accessor.setValue([
                val[0] === undefined ? undefined : val[0].getTime() as any,
                val[1] === undefined ? undefined : val[1].getTime() as any
            ]);
            return;
        default:
            props.accessor.setValue(val as any);
            return;
        }
    };

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    return <Field class={joinClass(undefined, styles.activator, props.class)}
        title={props.title} palette={props.palette} aria-haspopup
    >
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} ref={el => anchorRef = el}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            onClick={() => togglePop(anchorRef, panelRef)}
            class={joinClass(undefined, styles['activator-container'], props.rounded ? styles.rounded : undefined)}
        >
            <input id={id} readOnly disabled={props.disabled} placeholder={props.placeholder}
                class={joinClass(undefined, styles.input, styles.range)}
                value={formater()(getValue()?.[0])}
            />
            <div class="px-1 shrink-0">{props.arrowIcon}</div>
            <input readOnly disabled={props.disabled} placeholder={props.placeholder}
                class={joinClass(undefined, styles.input, styles.range)}
                value={formater()(getValue()?.[1])}
            />

            <Show when={hover() && props.accessor.getValue()} fallback={<IconExpandAll class="shrink-0" />}>
                <IconClose class="shrink-0" onClick={e => {
                    e.stopPropagation();
                    props.accessor.setValue(undefined);
                }} />
            </Show>
        </div>

        <fieldset popover="auto" disabled={props.disabled} ref={el => panelRef = el} class={styles.panel} aria-haspopup>

            <DateRangePanel class={styles['dt-panel']} {...panelProps}
                value={getValue()} onChange={change}
            />

            <div class={joinClass(undefined, styles.actions, '!justify-end')}>
                <Button kind='flat' class='py-0 px-1' onclick={() => {
                    props.accessor.setValue([undefined, undefined]);
                    panelRef.hidePopover();
                }}>{l.t('_c.date.clear')}</Button>

                <Button kind='flat' class='py-0 px-1' onclick={() => {
                    props.accessor.reset();
                    panelRef.hidePopover();
                }}>{l.t('_c.reset')}</Button>
            </div>
        </fieldset>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
