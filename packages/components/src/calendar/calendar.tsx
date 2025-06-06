// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, createMemo, createSignal, mergeProps } from 'solid-js';
import IconArrowBack from '~icons/material-symbols/arrow-back-ios';
import IconArrowForward from '~icons/material-symbols/arrow-forward-ios';

import { BaseProps } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { useLocale } from '@/context';
import { Week, sunday, weekDay, weekDays, weeks } from '@/form/date/utils';
import { Plugin } from './plugin';

/**
 * 日历 {@link Calendar} 的属性值
 */
export interface Props extends BaseProps {
    /**
     * 允许的最小日期
     */
    min?: Date;

    /**
     * 允许的最大日期
     */
    max?: Date;

    /**
     * 一周的开始，默认为 0，即周日。
     */
    weekBase?: Week;

    /**
     * 当前显示的月份
     */
    current?: Date;

    /**
     * 选中项
     */
    selected?: Date;

    /**
     * 用户改变选中项时触发的事件
     */
    onSelected?: { (val: Date, old?: Date): void; };

    /**
     * 插件列表
     */
    plugins?: Array<Plugin>;

    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

const presetProps: Props = {
    weekBase: 0,
} as const;

/**
 * 日历组件
 */
export default function Calendar(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const l = useLocale();
    const [curr, setCurr] = createSignal(props.current ?? new Date());
    const year = createMemo(() => curr().getFullYear());

    const weekFormat = createMemo(() => { return l.dateTimeFormat({ weekday: 'long' }); });

    const titleFormat = createMemo(() => {
        return l.dateTimeFormat({ year: 'numeric', month: '2-digit' }).format(curr());
    });

    const now = new Date();

    const [selected, setSelected] = createSignal(props.selected);

    return <div class={props.class} style={props.style} classList={{
        ...props.classList,
        'c--calendar': true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        <header>
            <p class="title">{titleFormat()}</p>
            <div>
                <ButtonGroup kind='fill'>
                    <Button title={l.t('_c.date.prevMonth')} icon onClick={() => setCurr(new Date(curr().getFullYear(), curr().getMonth() - 1, 1))}><IconArrowBack /></Button>
                    <Button onClick={() => setCurr(new Date())}>{l.t('_c.date.today')}</Button>
                    <Button title={l.t('_c.date.nextMonth')} icon onClick={() => setCurr(new Date(curr().getFullYear(), curr().getMonth() + 1, 1))}><IconArrowForward /></Button>
                </ButtonGroup>
            </div>
        </header>

        <table class="calendar">
            <thead>
                <tr>
                    <For each={weeks}>
                        {(w) => (
                            <th>{weekFormat().format((new Date(sunday)).setDate(sunday.getDate() + weekDay(w, props.weekBase)))}</th>
                        )}
                    </For>
                </tr>
            </thead>
            <tbody>
                <For each={weekDays(curr(), props.weekBase!, props.min, props.max)}>
                    {(week) => (
                        <tr>
                            <For each={week}>
                                {(day) => {
                                    const d = new Date(year(), day[1], day[2], 8);

                                    return <td onclick={()=>{
                                        if (!day[0]) { return; }

                                        if (props.onSelected) { props.onSelected(d, selected()); }
                                        setSelected(d);
                                    }} classList={{
                                        'disabled': !day[0],
                                        'current': selected()
                                            && (selected()!.getMonth() === day[1])
                                            && (day[2] === selected()!.getDate())
                                            && (curr().getFullYear() === selected()!.getFullYear())
                                    }}>
                                        <span classList={{
                                            'day': true,
                                            'today': (day[1] === now.getMonth())
                                                && (curr().getFullYear() === now.getFullYear())
                                                && (day[2] === now.getDate())
                                        }}>{day[2]}</span>
                                        <For each={props.plugins}>
                                            {(plugin) => { return plugin(d); }}
                                        </For>
                                    </td>;
                                }}
                            </For>
                        </tr>
                    )}
                </For>
            </tbody>
        </table>
    </div>;
}