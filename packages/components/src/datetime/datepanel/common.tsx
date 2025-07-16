// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, mergeProps, onCleanup, Show, untrack } from 'solid-js';
import IconPrevMonth from '~icons/material-symbols/chevron-left';
import IconNextMonth from '~icons/material-symbols/chevron-right';
import IconPrevYear from '~icons/material-symbols/keyboard-double-arrow-left';
import IconNextYear from '~icons/material-symbols/keyboard-double-arrow-right';

import { BaseProps, joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { DateView, DateViewProps, DateViewRef } from '@/datetime/dateview';
import { DatetimePlugin } from '@/datetime/plugin';
import { TimePanel } from '@/datetime/timepanel';
import { DateChange, Week } from '@/datetime/utils';
import styles from './style.module.css';

export interface Props extends BaseProps {
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

    /**
     * 翻页时的回调函数
     * @param val 新页面的日期；
     * @param old 旧页面的日期；
     */
    onPaging?: DateViewProps['onPaging'];

    onHover?: DateViewProps['onHover'];

    ref?: { (el: HTMLFieldSetElement): void; };

    /**
     * 获取 {@link DateViewRef} 接口
     */
    viewRef?: { (el: DateViewRef): void; };

    /**
     * 插件列表
     *
     * NOTE: 这是一个非响应式的属性。
     */
    plugins?: Array<DatetimePlugin>;

    class?: string;
}

export const presetProps: Partial<Props> = {
    weekBase: 0,
} as const;

/**
 * DatePanel 和 RangePanel 的公共部分
 */
export function CommonPanel(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    const [value, setValue] = createSignal<Date | undefined>(props.value); // 实际的值
    const [dateViewRef, setDateViewRef] = createSignal<DateViewRef>();

    // 改变值且触发 onchange 事件
    const change = (val?: Date) => {
        if (val) { dateViewRef()?.jump(val); }

        const old = untrack(value);
        if (old === val) { return; }

        if (old) { dateViewRef()?.unselect(old); }
        if (val) { dateViewRef()?.select(val); }
        setValue(val);

        if (props.onChange) { props.onChange(val, old); }
    };

    createEffect(() => {
        if (props.value !== untrack(value)) { change(props.value); }
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
            <Button title={l.t('_c.date.prevYear')} square disabled={!dateViewRef()?.canOffset(-1, 0)}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }
                    dateViewRef()?.offset(-1, 0);
                }}><IconPrevYear /></Button>
            <Button title={l.t('_c.date.prevMonth')} square disabled={!dateViewRef()?.canOffset(0, -1)}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }
                    dateViewRef()?.offset(0, -1);
                }}><IconPrevMonth /></Button>
        </div>

        <div>{dateViewRef()?.Title()}</div>

        <div class="flex">
            <Button title={l.t('_c.date.followingMonth')} square disabled={!dateViewRef()?.canOffset(0, 1)}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }
                    dateViewRef()?.offset(0, 1);
                }}><IconNextMonth /></Button>
            <Button title={l.t('_c.date.followingYear')} square disabled={!dateViewRef()?.canOffset(1, 0)}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }
                    dateViewRef()?.offset(1, 0);
                }}><IconNextYear /></Button>
        </div>
    </div>;

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }} disabled={props.disabled}
        class={joinClass(styles.panel, props.class, props.palette ? `palette--${props.palette}` : undefined)}>
        <div class={styles.wrap} ref={el => dateRef = el}>
            {title}
            <DateView initValue={value() ?? new Date()} min={props.min} max={props.max} disabledClass={styles.disabled}
                selectedClass={styles.selected} coveredClass={styles.covered} todayClass={styles.today}
                weekend={props.weekend} weekBase={props.weekBase} weekName='narrow'
                plugins={props.plugins} onHover={props.onHover} onPaging={props.onPaging}
                onClick={(d, disabled) => {
                    if (!disabled && !props.disabled && !props.readonly) { change(d); }
                }}
                ref={el => {
                    setDateViewRef(el);
                    if (props.viewRef) { props.viewRef(el); }
                }}
            />
        </div>

        <Show when={props.time}>
            <TimePanel ref={el => setTimeRef(el)} disabled={props.disabled} readonly={props.readonly} value={value()} class="border-none"
                onChange={d => {
                    if (!props.disabled && !props.readonly) { change(d); }
                }}
            />
        </Show>
    </fieldset>;
}
