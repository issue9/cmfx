// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, JSX, untrack } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { months } from '@/datetime/utils';
import { adjustPopoverPosition } from '@cmfx/core';
import styles from './style.module.css';
import { default as YearPanel, Ref as YearPanelRef } from './yearpanel';

export interface Ref {
    element(): HTMLFieldSetElement;
}

export interface Props extends BaseProps, RefProps<Ref> {
    disabled?: boolean;
    readonly?: boolean;

    popover?: boolean | 'manual' | 'auto';

    min?: Date;
    max?: Date;

    /**
     * 关联的值
     */
    value?: Date;

    /**
     * 值发生改变时触发的事件
     */
    onChange?: { (val?: Date, old?: Date): void; };
}

/**
 * 月份选择面板
 */
export default function MonthPanel(props: Props): JSX.Element {
    const [value, setValue] = createSignal<Date | undefined>(props.value);
    const [year, setYear] = createSignal<number>(props.value?.getFullYear() ?? new Date().getFullYear());

    // 监视 props.value 变化
    createEffect(() => {
        const old = untrack(value);
        setValue(props.value);
        setYear(props.value?.getFullYear() ?? new Date().getFullYear());
        if (props.onChange) { props.onChange(props.value, old); }
    });

    const change = (v?: Date) => {
        if (props.disabled || props.readonly) { return; }

        const old = untrack(value);
        if (old === v) { return; }

        setValue(v);
        if (props.onChange) { props.onChange(v, old); }
    };

    const l = useLocale();

    const monthFomatter = createMemo(() => {
        const s = l.displayStyle === 'full' ? 'long' : (l.displayStyle === 'short' ? 'short' : 'narrow');
        return (new Intl.DateTimeFormat(l.locale.toString(), { month: s })).format;
    });

    let yearRef: YearPanelRef | undefined;

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref({element: () => el}); } }}
        disabled={props.disabled} class={joinClass(props.palette, styles.panel, props.class)}
    >
        <header class={styles.month}>
            <span class={styles.title} onClick={e => {
                yearRef!.element().togglePopover();
                adjustPopoverPosition(yearRef!.element(), e.currentTarget.getBoundingClientRect());
            }}>{year()}</span>

            <YearPanel popover='auto' ref={el => yearRef = el} palette={props.palette} value={value()?.getFullYear()}
                min={props.min ? props.min.getFullYear() : undefined}
                max={props.max ? props.max.getFullYear() : undefined}
                onChange={v => {
                    if (!v) { return; }

                    setYear(v);
                    yearRef!.element().hidePopover();
                }} />
        </header>

        <div class={styles.grid}>
            <For each={months}>
                {month => {
                    return <Button kind='flat' checked={value()?.getMonth() === month && year() === value()?.getFullYear()}
                        disabled={value()
                            && ((props.min && (new Date(year(), month, 1)) < props.min)
                            || (props.max && (new Date(year(), month, 1)) > props.max))
                        }
                        onclick={() => { change(new Date(year(), month)); }}
                    >
                        {monthFomatter()(new Date(2000, month, 1))}
                    </Button>;
                }}
            </For>
        </div>
    </fieldset>;
}
