// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, mergeProps, onCleanup, Show, untrack } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { DateView, DateViewProps, DateViewRef } from '@/datetime/dateview';
import { DatetimePlugin } from '@/datetime/plugin';
import { TimePanel, TimePanelRef } from '@/datetime/timepanel';
import { Week } from '@/datetime/utils';
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

    /**
     * 是否显示周数
     *
     * NOTE: 周数是依据 ISO 8601 拿所在行的中间列计算所得。
     * 如果 {@link Props#weekBase} 不为 1，那么周数指向的可能并不是当前行。
     */
    weeks?: boolean;

    /**
     * 点击周数时的回调函数
     * @param week - 周数；
     * @param range - 周数范围；
     */
    onWeekClick?: DateViewProps['onWeekClick'];

    popover?: boolean | 'manual' | 'auto';

    /**
     * 关联的值
     */
    value?: Date;

    /**
     * 值发生改变时触发的事件
     *
     * val 表示修改的新值；
     * old 表示修改之前的值；
     * time 是否只修改了时间部分，该值只有在 {@link Props#time} 为 true 时才有效；
     *
     * 此方法只在以下条件下触发：
     * - 点击天数；
     * - 点击小时、分钟和秒；
     */
    onChange?: { (val?: Date, old?: Date, time?: boolean): void; };

    /**
     * 翻页时的回调函数
     * @param val - 新页面的日期；
     * @param old - 旧页面的日期；
     */
    onPaging?: DateViewProps['onPaging'];

    onEnter?: DateViewProps['onEnter'];
    onLeave?: DateViewProps['onLeave'];

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
}

export const presetProps: Partial<Props> = {
    weekBase: 0,
} as const;

/**
 * DatePanel 和 RangePanel 的公共部分
 */
export function CommonPanel(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const [value, setValue] = createSignal<Date | undefined>(props.value); // 实际的值
    const [dateViewRef, setDateViewRef] = createSignal<DateViewRef>();

    // 改变值且触发 onchange 事件
    const change = (val?: Date, time?: boolean) => {
        const old = untrack(value);
        if (old === val) { return; }

        if (val && !time) {
            if (old) { // 切换日期时，继承时间部分
                val.setHours(old.getHours(), old.getMinutes(), old.getSeconds());
            }

            dateViewRef()?.jump(val);
        }

        setValue(val);
        if (old) { dateViewRef()?.unselect(old); }
        if (val) { dateViewRef()?.select(val); }

        if (props.onChange) { props.onChange(val, old, time); }
    };

    createEffect(() => {
        if (props.value !== untrack(value)) { change(props.value); }
    });

    let dateRef: HTMLFieldSetElement;
    const [timeRef, setTimeRef] = createSignal<TimePanelRef>();
    let resizeObserver: ResizeObserver;

    createEffect(() => {
        if (resizeObserver) { resizeObserver.disconnect(); }

        // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
        resizeObserver = new ResizeObserver(entries => {
            const ref = timeRef();
            if (ref) { ref.element().style.height = entries[0]!.borderBoxSize[0].blockSize.toString() + 'px'; }
        });

        if (timeRef()) { resizeObserver.observe(dateRef!.firstChild as HTMLElement); }
    });

    onCleanup(() => {
        if (resizeObserver) { resizeObserver.disconnect(); }
    });

    return <fieldset disabled={props.disabled} popover={props.popover}
        class={joinClass(props.palette, styles.panel, props.class)} style={props.style}
        ref={el => {
            if (props.ref) { props.ref(el); }
            dateRef = el;
        }}
    >
        <DateView initValue={value() ?? new Date()} min={props.min} max={props.max} disabledClass={styles.disabled}
            selectedClass={styles.selected} coveredClass={styles.covered} todayClass={styles.today}
            weekend={props.weekend} weekBase={props.weekBase} weekName='narrow' plugins={props.plugins}
            weeks={props.weeks} onWeekClick={props.onWeekClick} onEnter={props.onEnter} onLeave={props.onLeave}
            onPaging={props.onPaging} disabled={props.disabled} readonly={props.readonly} class={styles.dateview}
            onClick={(d, disabled) => {
                if (!disabled && !props.disabled && !props.readonly) { change(d); }
            }}
            ref={el => {
                setDateViewRef(el);
                if (props.viewRef) { props.viewRef(el); }
            }}
        />

        <Show when={props.time}>
            <TimePanel disabled={props.disabled} readonly={props.readonly}
                value={value()} class={styles.timer} ref={el=>setTimeRef(el)}
                onChange={d => {
                    if (!props.disabled && !props.readonly) { change(d, true); }
                }}
            />
        </Show>
    </fieldset>;
}
