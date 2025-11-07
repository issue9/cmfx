// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { arrayEqual } from '@cmfx/core';
import {
    createEffect, createMemo, createSignal, Match, onCleanup, onMount, Show, splitProps, Switch, untrack
} from 'solid-js';

import { joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { DateViewRef } from '@/datetime/dateview';
import { CommonPanel, Props as CommonProps } from './common';
import {
    DateRangeValueType, nextQuarter, nextYear, prevMonth, prevQuarter, prevYear, thisQuarter, thisYear
} from './shortcuts';
import styles from './style.module.css';

export interface Props extends Omit<CommonProps, 'value' | 'onChange' | 'viewRef' | 'onEnter' | 'onLeave'> {
    value?: DateRangeValueType;

    onChange?: { (val?: DateRangeValueType, old?: DateRangeValueType): void; };

    /**
     * 是否显示右侧快捷选择栏
     */
    shortcuts?: boolean;
}

/**
 * 日期范围选择组件
 */
export function DateRangePanel(props: Props) {
    const [_, panelProps] = splitProps(props, ['value', 'onChange', 'popover', 'ref', 'class', 'palette', 'style']);

    const l = useLocale();
    let viewRef1: DateViewRef;
    let viewRef2: DateViewRef;

    const [values, setValues] = createSignal<DateRangeValueType>(props.value ?? [undefined, undefined]);
    let index = 0; // 当前设置的值属于 values 的哪个索引值

    const [page1, setPage1] = createSignal<Date>(values()[0] ?? new Date());
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    const [page2, setPage2] = createSignal<Date>(values()[1] ?? now);

    const changeTime = (value: Date, first?: boolean) => {
        if (index === 1) { return; }

        if (first) {
            setValues(prev => {
                const first = prev[0];
                first?.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
                return [first, prev[1]];
            });
        } else {
            setValues(prev => {
                const secondary = prev[1];
                secondary?.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
                return [prev[0], secondary];
            });
        }
    };

    // 面板值发生变化时，触发的事件
    //
    // time 是否只修改时间部分；
    // start 是否为修改第一个面板的值；
    // onchange 是否触发 onChange 事件；
    const panelChange = (value?: Date, time?: boolean, start?: boolean, onchange?: boolean) => {
        const old = [...untrack(values)] as DateRangeValueType;

        if (!value) { // 只有在 Props.value === [undefined, undefined] 时才会有可能 !value 成立。
            viewRef1?.unselect(...old);
            viewRef2?.unselect(...old);
            viewRef1?.uncover();
            viewRef2?.uncover();
            return;
        }

        if (time) { // 对时间部分作了修改
            changeTime(value, start);
            return;
        }

        viewRef1?.unselect(...old);
        viewRef2?.unselect(...old);

        switch (index) {
        case 0:
            setValues(prev => {
                const first = start ? prev[0] : prev[1];
                if (first) { // 改变日期，则继承之前的时间。
                    value.setHours(first.getHours(), first.getMinutes(), first.getSeconds());
                }
                return start ? [value, undefined] : [undefined, value];
            });
            viewRef1?.uncover();
            viewRef2?.uncover();
            break;
        case 1:
            setValues(prev => {
                const ret = prev[0] ? [prev[0], value] : [value, prev[1]];
                ret.sort((a, b) => (a ? a.getTime() : 0) - (b ? b.getTime() : 0));
                return ret as DateRangeValueType;
            });
            const vals = untrack(values) as [Date, Date];
            viewRef1?.cover(vals);
            viewRef2?.cover(vals);
            viewRef1.jump(vals[0]!);
            viewRef2.jump(vals[1]!);
            break;
        }

        viewRef1?.select(value);
        viewRef2?.select(value);

        index = index === 0 ? 1 : 0;

        if (props.onChange && onchange) { props.onChange(values(), old); }
    };

    // 监视外部直接通过 props.value 修改
    createEffect(() => {
        const old = untrack(values);
        if (props.value === old || (props.value && arrayEqual(old, props.value))) { return; }

        viewRef1?.unselect(...old);
        viewRef2?.unselect(...old);

        const v = props.value || [undefined, undefined];
        if (arrayEqual(v, [undefined, undefined])) {
            viewRef1?.uncover();
            viewRef2?.uncover();

            setValues(v);
            index = 0;
            if (props.onChange) { props.onChange(values(), old); }

            return;
        }

        const vals = v as [Date, Date];
        viewRef1?.cover(vals);
        viewRef2?.cover(vals);

        if (vals[0]) {
            viewRef1.jump(vals[0]);
            viewRef1?.select(vals[0]);
            changeTime(vals[0], true);
        }
        if (vals[1]) {
            viewRef2.jump(vals[1]);
            viewRef2?.select(vals[1]);
            changeTime(vals[1], false);
        }

        setValues(vals);
        index = 0;
        if (props.onChange) { props.onChange(values(), old); }
    });

    const valueFormater = createMemo(() => {
        return props.time ? l.datetimeFormat() : l.dateFormat();
    });

    onMount(() => {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (!props.value) {
            viewRef2.jump(nextMonth);
        } else if (!props.value[1]) {
            if (!props.value[0]) {
                viewRef2.jump(nextMonth);
            } else {
                const next = new Date(props.value[0]);
                next.setMonth(next.getMonth() + 1);
                viewRef2.jump(next);
            }
        }
    });

    const onEnter = (e: Date) => {
        if (index === 1) {
            const v = values();
            const f = v[0] ?? v[1]!; // 由 index === 1 保证至少有一个值非 undefined 值
            viewRef1.cover([f, e]);
            viewRef2.cover([f, e]);
        }
    };

    const onLeave = () => {
        if (index === 1) {
            viewRef1.uncover();
            viewRef2.uncover();
        }
    };

    const setShortcuts = (vals: DateRangeValueType) => {
        setValues(vals);

        viewRef1?.cover(vals as [Date, Date]);
        viewRef2?.cover(vals as [Date, Date]);
        viewRef1?.select(vals[0]!, vals[1]!);
        viewRef2?.select(vals[0]!, vals[1]!);
        viewRef1.jump(vals[0]!);
        viewRef2.jump(vals[1]!);
    };

    /* 保证 flex-wrap 换行之后，边框显示的正确性 */

    let resizeObserver: ResizeObserver;
    const [panel1, setPanel1] = createSignal<HTMLFieldSetElement>();
    let panel2: HTMLFieldSetElement;
    createEffect(() => {
        if (resizeObserver) { resizeObserver.disconnect(); }

        // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
        resizeObserver = new ResizeObserver(entries => {
            const ref = panel1();
            if (ref) {
                const p2Left = (entries[0].target as HTMLElement).getBoundingClientRect().left;
                if (p2Left === ref.getBoundingClientRect().left) {
                    panel2.style.setProperty('border-top-color', 'var(--fg-low)');
                    panel2.style.setProperty('border-inline-start-color', 'transparent');
                } else {
                    panel2.style.setProperty('border-inline-start-color', 'var(--fg-low)');
                    panel2.style.setProperty('border-top-color', 'transparent');
                }
            }
        });

        if (panel1()) { resizeObserver.observe(panel2); }
    });
    onCleanup(() => { if (resizeObserver) { resizeObserver.disconnect(); } });

    return <fieldset disabled={props.disabled} popover={props.popover}
        class={joinClass(props.palette, styles.range, props.class)} style={props.style}
        ref={el => { if (props.ref) { props.ref(el); } }}
    >
        <main>
            <div class={styles.panels}>
                <CommonPanel {...panelProps} value={values()[0]} class={styles.panel}
                    viewRef={el => viewRef1 = el} onEnter={onEnter} onLeave={onLeave}
                    ref={el => setPanel1(el)} onChange={(val, _, time) => {
                        if (val === values()[0]) { return; }
                        panelChange(val, time, true, true);
                    }}
                    onPaging={val => {
                        setPage1(val);
                        if (compareMonth(page2(), val) < 0) {
                            const v = new Date(val);
                            v.setMonth(v.getMonth() + 1);
                            viewRef2.jump(v);
                        }
                    }}
                />
                <CommonPanel {...panelProps} value={values()[1]} class={styles.panel}
                    viewRef={el => viewRef2 = el} onEnter={onEnter} onLeave={onLeave}
                    ref={el => panel2 = el} onChange={(val, _, time) => {
                        if (val === values()[1]) { return; }
                        panelChange(val, time, false, true);
                    }}
                    onPaging={val => {
                        setPage2(val);
                        if (compareMonth(page1(), val) > 0) {
                            const v = new Date(val);
                            v.setMonth(v.getMonth() - 1);
                            viewRef1.jump(v);
                        }
                    }}
                />
            </div>
            <div class={styles.value}>
                <Switch>
                    <Match when={values()[0] && values()[1]}>
                        {valueFormater().formatRange(values()[0]!, values()[1]!)}
                    </Match>
                    <Match when={values()[0] || values()[1]}>
                        {val => { return valueFormater().format(val()); }}
                    </Match>
                </Switch>
            </div>
        </main>

        <Show when={props.shortcuts}>
            <div class={styles.shortcuts}>
                <Button class="justify-start" onclick={() => setShortcuts(prevMonth())}>
                    {l.t('_c.date.lastMonth')}
                </Button>

                <Button class="justify-start" onclick={() => setShortcuts(prevQuarter())}>
                    {l.t('_c.date.lastQuarter')}
                </Button>
                <Button class="justify-start" onclick={() => setShortcuts(thisQuarter())}>
                    {l.t('_c.date.thisQuarter')}
                </Button>
                <Button class="justify-start" onclick={() => setShortcuts(nextQuarter())}>
                    {l.t('_c.date.nextQuarter')}
                </Button>

                <Button class="justify-start" onclick={() => setShortcuts(prevYear())}>
                    {l.t('_c.date.lastYear')}
                </Button>
                <Button class="justify-start" onclick={() => setShortcuts(thisYear())}>
                    {l.t('_c.date.thisYear')}
                </Button>
                <Button class="justify-start" onclick={() => setShortcuts(nextYear())}>
                    {l.t('_c.date.nextYear')}
                </Button>
            </div>
        </Show>
    </fieldset>;
}

function compareMonth(d1: Date, d2: Date): number {
    return d1.getMonth() - d2.getMonth() + (d1.getFullYear() - d2.getFullYear()) * 12;
}
