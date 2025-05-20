// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, createMemo, createSignal, mergeProps } from 'solid-js';

import { BaseProps } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { useLocale } from '@/context';
import { Week, weekDay, weekDays, weeks } from '@/form/date/utils';
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
     * 插件列表
     */
    plugins?: Array<Plugin>;

    /**
     * 改变用户点击的日期方格
     */
    onchange?: { (d: Date): void; };

    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

const weekBase = new Date('2024-10-20'); // 这是星期天，作为计算星期的基准日期。

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

    return <div class={props.class} style={props.style} classList={{
        ...props.classList,
        'c--calendar': true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        <header>
            <p class="title">{titleFormat()}</p>
            <div>
                <ButtonGroup kind='fill'>
                    <Button icon onClick={() => setCurr(new Date(curr().getFullYear(), curr().getMonth() - 1, 1))}>arrow_back_ios</Button>
                    <Button onClick={() => setCurr(new Date())}>{l.t('_i.date.today')}</Button>
                    <Button icon onClick={() => setCurr(new Date(curr().getFullYear(), curr().getMonth() + 1, 1))}>arrow_forward_ios</Button>
                </ButtonGroup>
            </div>
        </header>

        <table class="calendar">
            <thead>
                <tr>
                    <For each={weeks}>
                        {(w) => (
                            <th>{weekFormat().format((new Date(weekBase)).setDate(weekBase.getDate() + weekDay(w, props.weekBase)))}</th>
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
                                        if (props.onchange) { props.onchange(d); }
                                        setCurr(d);
                                    }} classList={{
                                        'disabled': !day[0],
                                        'current': (curr().getMonth() === week[1] as unknown as number) && (day[2] === curr().getDate())
                                    }}>
                                        <span classList={{
                                            'day': true,
                                            'today': (curr().getMonth() === now.getMonth()) && (curr().getFullYear() === now.getFullYear()) && (day[2] === now.getDate())
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
