// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, JSX, mergeProps, onCleanup, Show, untrack } from 'solid-js';
import IconChevronLeft from '~icons/material-symbols/chevron-left';
import IconChevronRight from '~icons/material-symbols/chevron-right';
import IconArrowLeft from '~icons/material-symbols/keyboard-double-arrow-left';
import IconArrowRight from '~icons/material-symbols/keyboard-double-arrow-right';

import { BaseProps, joinClass } from '@/base';
import { useLocale } from '@/context';
import { DateView, DateViewRef } from '@/datetime/dateview';
import { DateChange, Week } from '@/datetime/utils';
import { TimePanel } from '../timepanel';
import styles from './style.module.css';

export interface Props extends BaseProps {
    tabindex?: number;
    disabled?: boolean;
    readonly?: boolean;

    /**
     * 是否符带时间选择器
     */
    time?: boolean;

    /**
     * 允许的最小日期
     */
    min?: Date;

    /**
     * 允许的最大日期
     */
    max?: Date;

    /**
     * 是否高亮周末的列
     */
    weekend?: boolean;

    /**
     * 一周的开始，默认为 0，即周日。
     */
    weekBase?: Week;

    popover?: boolean | 'manual' | 'auto';

    /**
     * 关联的值
     */
    value?: Date;

    /**
     * 值发生改变时触发的事件
     *
     * 此方法只在以下条件下触发：
     * - 点击天数始终触发；
     * - 在已经点击过天数的情况下，点击小时和分钟也触发；
     */
    onChange?: DateChange;

    ref?: { (el: HTMLFieldSetElement): void; };

    class?: string;
}

export const presetProps: Partial<Props> = {
    weekBase: 0,
} as const;

/**
 * 日期选择的面板
 */
export function DatePanel(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    const [panelValue, setPanelValue] = createSignal<Date>(props.value ?? new Date()); // 面板上当前页显示的时候
    const [value, setValue] = createSignal<Date | undefined>(props.value); // 实际的值

    const changePanelValue = (val: Date) => {
        setPanelValue(val);
    };

    let dateViewRef: DateViewRef;

    // 改变值且触发 onchange 事件
    const change = (val?: Date) => {
        changePanelValue(val ?? new Date());

        const old = untrack(value);

        if (old === val) { return; }

        if (old) { dateViewRef.unselect(old); }
        if (val) { dateViewRef.select(val); }
        setValue(val);
        if (props.onChange) { props.onChange(val, old); }
    };

    createEffect(() => {
        if (props.value !== value()) { change(props.value); }
    });

    const titleFormat = createMemo(() => {
        return l.datetimeFormat({ year: 'numeric', month: '2-digit' }).format(panelValue());
    });

    let dateRef: HTMLDivElement;
    const [timeRef, setTimeRef] = createSignal<HTMLElement>();
    let resizeObserver: ResizeObserver;

    createEffect(() => {
        if (resizeObserver) { resizeObserver.disconnect(); }

        if (!timeRef()) { return; }

        // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
        resizeObserver = new ResizeObserver(entries => {
            const ref = timeRef();
            if (ref) {
                ref.style.height = entries[0]!.borderBoxSize[0].blockSize.toString() + 'px';
            }
        });

        resizeObserver.observe(dateRef!);
    });

    onCleanup(() => {
        if (resizeObserver) { resizeObserver.disconnect(); }
    });

    // 年月标题
    const title = <div class={styles.title}>
        <div class="flex">
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.prevYear')} aria-label={l.t('_c.date.prevYear')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setFullYear(dt.getFullYear() - 1);
                    changePanelValue(dt);
                }}><IconArrowLeft /></button>
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.prevMonth')} aria-label={l.t('_c.date.prevMonth')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setMonth(dt.getMonth() - 1);
                    changePanelValue(dt);
                }}><IconChevronLeft /></button>
        </div>

        <div>{titleFormat()}</div>

        <div class="flex">
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.nextMonth')} aria-label={l.t('_c.date.nextMonth')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setMonth(dt.getMonth() + 1);
                    changePanelValue(dt);
                }}><IconChevronRight /></button>
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.nextYear')} aria-label={l.t('_c.date.nextYear')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setFullYear(dt.getFullYear() + 1);
                    changePanelValue(dt);
                }}><IconArrowRight /></button>
        </div>
    </div>;

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }} disabled={props.disabled}
        class={joinClass(styles.panel, props.class, props.palette ? `palette--${props.palette}` : undefined)}>
        <div ref={el => dateRef = el}>
            {title}
            <DateView value={panelValue} ref={el => dateViewRef = el} min={props.min} max={props.max}
                selectedClass={styles.selected} coveredClass={styles.covered} todayClass={styles.today} disabledClass={styles.disabled}
                weekend={props.weekend} weekBase={props.weekBase} weekName='narrow'
                onClick={(d, disabled) => { if (!disabled) { change(d); } }}
            />
        </div>

        <Show when={props.time}>
            <TimePanel ref={el =>setTimeRef(el)} disabled={props.disabled} readonly={props.readonly} value={value()} class="border-none"
                onChange={d => {
                    if (props.disabled || props.readonly) { return; }
                    change(d);
                }}
            />
        </Show>
    </fieldset>;
}
