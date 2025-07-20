// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    createEffect, createMemo, createSignal, Match, onCleanup, onMount, Show, splitProps, Switch, untrack
} from 'solid-js';

import { joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { DateViewRef } from '@/datetime/dateview';
import { CommonPanel, Props as CommonProps } from './common';
import {
    nextQuarter, nextYear, prevMonth, prevQuarter, prevYear, RangeValueType, thisQuarter, thisYear
} from './shortcuts';
import styles from './style.module.css';

export interface Props extends Omit<CommonProps, 'value' | 'onChange' | 'viewRef' | 'onHover'> {
    value?: RangeValueType;

    onChange?: (value?: RangeValueType, old?: RangeValueType) => void;

    /**
     * 是否显示右侧快捷选择栏
     */
    shortcuts?: boolean;
}

/**
 * 日期范围选择组件
 */
export function DateRangePanel(props: Props) {
    const [_, panelProps] = splitProps(props, ['value', 'onChange', 'popover', 'ref', 'class', 'palette']);

    const l = useLocale();
    let viewRef1: DateViewRef;
    let viewRef2: DateViewRef;

    const [values, setValues] = createSignal<RangeValueType>(props.value ?? [undefined, undefined]);
    let index = 0; // 当前设置的值属于 values 的哪个索引值

    const [page1, setPage1] = createSignal<Date>(values()[0] ?? new Date());
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    const [page2, setPage2] = createSignal<Date>(values()[1] ?? now);

    const panelChange = (value: Date, time?: boolean, start?: boolean) => {
        const old = [...untrack(values)];

        if (time) { // 如果仅改变了时间部分，那么只需要修改值，而不是重置整个 values。
            if (index === 1) { return; }

            if (start) { // 第一个面板
                setValues(prev => { return [value, prev[1]]; });
            } else {
                setValues(prev => { return [prev[0], value]; });
            }

            return;
        }

        switch (index) {
        case 0:
            setValues([value, undefined]);

            viewRef1?.uncover();
            viewRef2?.uncover();
            viewRef1?.unselect(...old);
            viewRef2?.unselect(...old);

            viewRef1?.select(value);
            viewRef2?.select(value);

            break;
        case 1:
            setValues(prev => {
                const cpy = [...prev];
                cpy[1] = value;
                cpy.sort((a, b) => (a ? a.getTime() : 0) - (b ? b.getTime() : 0));

                viewRef1?.cover(cpy as [Date, Date]);
                viewRef2?.cover(cpy as [Date, Date]);
                viewRef1?.select(cpy[0]!, cpy[1]);
                viewRef2?.select(cpy[0]!, cpy[1]);

                return cpy as RangeValueType;
            });

            break;
        }

        index = index === 0 ? 1 : 0;

        if (props.onChange) { props.onChange(untrack(values), old as RangeValueType); }
    };

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

    const onHover = (e: Date) => {
        if (index === 1) {
            viewRef1.cover([values()[0]!, e]);
            viewRef2.cover([values()[0]!, e]);
        }
    };

    const setShortcuts = (vals: RangeValueType) => {
        setValues(vals);

        viewRef1?.cover(vals as [Date, Date]);
        viewRef2?.cover(vals as [Date, Date]);
        viewRef1?.select(vals[0]!, vals[1]!);
        viewRef2?.select(vals[0]!, vals[1]!);

        if (vals[0]) { viewRef1.jump(vals[0]); }
        if (vals[1]) { viewRef2.jump(vals[1]); }
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
                    panel2.style.setProperty('border-left-color', 'transparent');
                } else {
                    panel2.style.setProperty('border-left-color', 'var(--fg-low)');
                    panel2.style.setProperty('border-top-color', 'transparent');
                }
            }
        });

        if (panel1()) { resizeObserver.observe(panel2!); }
    });
    onCleanup(() => { if (resizeObserver) { resizeObserver.disconnect(); } });

    return <fieldset disabled={props.disabled} popover={props.popover}
        class={joinClass(styles.range, props.palette ? `palette--${props.palette}` : undefined, props.class)}
        ref={el => { if (props.ref) { props.ref(el); } }}
    >
        <main>
            <div class={styles.panels}>
                <CommonPanel {...panelProps} value={untrack(values)[0]} class={styles.panel}
                    viewRef={el => viewRef1 = el} onHover={onHover} ref={el => setPanel1(el)}
                    onChange={(val, _, time) => panelChange(val!, time, true)}
                    onPaging={val => {
                        setPage1(val);
                        if (page2() <= val) {
                            const v = new Date(val);
                            v.setMonth(v.getMonth() + 1);
                            viewRef2.jump(v);
                        }
                    }}
                />
                <CommonPanel {...panelProps} value={untrack(values)[1]} class={styles.panel}
                    viewRef={el => viewRef2 = el} onHover={onHover} ref={el => panel2 = el}
                    onChange={(val, _, time) => panelChange(val!, time, false)}
                    onPaging={val => {
                        setPage2(val);
                        if (page1() >= val) {
                            const v = new Date(val);
                            v.setMonth(v.getMonth() - 1);
                            viewRef1.jump(v);
                        }
                    }}
                />
            </div>
            <div class={styles.value}>
                <Switch>
                    <Match when={values()[1]}>
                        {valueFormater().formatRange(values()[0]!, values()[1]!)}
                    </Match>
                    <Match when={values()[0]}>
                        {valueFormater().format(values()[0])}
                    </Match>
                </Switch>
            </div>
        </main>

        <Show when={props.shortcuts}>
            <div class={styles.shortcuts}>
                <Button class="justify-start" onClick={() => setShortcuts(prevMonth())}>
                    {l.t('_c.date.lastMonth')}
                </Button>

                <Button class="justify-start" onClick={() => setShortcuts(prevQuarter())}>
                    {l.t('_c.date.lastQuarter')}
                </Button>
                <Button class="justify-start" onClick={() => setShortcuts(thisQuarter())}>
                    {l.t('_c.date.thisQuarter')}
                </Button>
                <Button class="justify-start" onClick={() => setShortcuts(nextQuarter())}>
                    {l.t('_c.date.nextQuarter')}
                </Button>

                <Button class="justify-start" onClick={() => setShortcuts(prevYear())}>
                    {l.t('_c.date.lastYear')}
                </Button>
                <Button class="justify-start" onClick={() => setShortcuts(thisYear())}>
                    {l.t('_c.date.thisYear')}
                </Button>
                <Button class="justify-start" onClick={() => setShortcuts(nextYear())}>
                    {l.t('_c.date.nextYear')}
                </Button>
            </div>
        </Show>
    </fieldset>;
}
