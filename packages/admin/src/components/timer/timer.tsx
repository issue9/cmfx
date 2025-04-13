// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Duration, formatDuration, parseDuration, second } from '@cmfx/core';
import { createEffect, createSignal, JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { BaseProps } from '@admin/components/base';
import { useApp } from '@admin/components/context';

type Field = 'days' | 'hours' | 'minutes' | 'seconds';

export const fields: ReadonlyMap<Field, number> = new Map<Field, number>([
    ['seconds', 0],
    ['minutes', 1],
    ['hours', 2],
    ['days', 3],
]);

/**
 * 倒计时的计时器
 */
export interface Props extends BaseProps {
    /**
     * 时间段
     *
     * 如果是 number 类型，表示的是纳秒。
     */
    duration: Duration;

    /**
     * 分隔符的内容
     */
    separator?: JSX.Element;

    /**
     * 需要显示的最小字段名称
     *
     * 默认为 minutes，即只显示分钟和秒数。
     *
     * 当指定的单位无法全部显示指定的值时，大于此单位的数值会换算累加到该单位上。
     * 比如：当只指定了 seconds，但是表示分钟的值也不为空，则分钟会转换为秒数累加在秒之上。
     */
    startField?: Field;

    /**
     * 频率
     *
     * 最小单位为秒，负数为减少 duration，直到为零。正数为增加。
     * 默认为 -1。
     */
    interval?: number;

    /**
     * 是否自动开始倒计时
     */
    autoStart?: boolean;

    /**
     * 每一步倒计时触发
     */
    onTick?: { (): void; };

    /**
     * 每一步倒计时触发
     */
    unit?: boolean;

    /**
     * 完成时触发
     */
    onComplete?: { (): void; };

    ref?: { (el: Ref): void; };

    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];
}

const presetProps: Partial<Props> = {
    startField: 'minutes',
    separator: ':',
    interval: -1,
} as const;

export interface Ref {
    /**
     * 切换开始和暂停状态
     */
    toggle(): void;

    /**
     * 开始计数
     */
    start(): void;

    /**
     * 暂停计数
     */
    pause(): void;
}

/**
 * 倒计时组件
 */
export default function Timer(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const [nano, setNano] = createSignal<number>(parseDuration(props.duration));
    const [dur, setDur] = createSignal<Intl.DurationInput>(formatDuration(nano()));

    createEffect(() => {
        setNano(parseDuration(props.duration));
    });
    createEffect(() => {
        setDur(formatDuration(nano()));
    });

    const tick = () => {
        setNano((old) => old + props.interval! * second);
        props.onTick && props.onTick();
        
        if (nano() <= 0) {
            pause();
            props.onComplete && props.onComplete();
        }
    };

    let intervalID: any;
    const start = () => {
        if (nano() > 0) {
            intervalID = setInterval(tick, 1000 * Math.abs(props.interval!));
        }
    };
    const pause = () => {
        clearInterval(intervalID);
        intervalID = 0;
    };

    if (props.autoStart) {
        onMount(start);
    }
    onCleanup(() => {
        if (intervalID) { // 非 autoStart 时，此值可能为空，需要进行一次判断。
            pause();
        }
    });

    if (props.ref) {
        props.ref({
            toggle() {
                if (intervalID) {
                    pause();
                } else {
                    start();
                }
            },

            start() { start(); },

            pause() { pause(); }
        });
    }

    const ctx = useApp();

    const format = (n: number): string => {
        const s = n.toString();
        if (s.length < 2) {
            return s.padStart(2, '0');
        }
        return s;
    };

    return <div class={props.class} classList={{
        ...props.classList,
        'c--timer': true,
    }}>
        <Show when={fields.get(props.startField!)! >= fields.get('days')!}>
            <div class="item">
                <span class="text">{format(dur().days ?? 0)}</span>
                <Show when={props.unit}><span class="unit">{ctx.locale().t('_i.timer.days')}</span></Show>
            </div>
            <div class="sep">{props.separator}</div>
        </Show>

        <Show when={fields.get(props.startField!)! >= fields.get('hours')!}>
            <div class="item">
                <span class="text">{
                    format((dur().hours ?? 0) + (props.startField! === 'hours' ? (dur().days ?? 0) * 24 : 0))
                }</span>
                <Show when={props.unit}><span class="unit">{ctx.locale().t('_i.timer.hours')}</span></Show>
            </div>
            <div class="sep">{props.separator}</div>
        </Show>

        <Show when={fields.get(props.startField!)! >= fields.get('minutes')!}>
            <div class="item">
                <span class="text">{
                    format(
                        (dur().minutes ?? 0) +
                        (props.startField! === 'minutes' ? ((dur().days ?? 0) * 24*60 + (dur().hours ?? 0) * 60) : 0)
                    )
                }</span>
                <Show when={props.unit}><span class="unit">{ctx.locale().t('_i.timer.minutes')}</span></Show>
            </div>
            <div class="sep">{props.separator}</div>
        </Show>

        <Show when={fields.get(props.startField!)! >= fields.get('seconds')!}>
            <div class="item">
                <span class="text">{
                    format(
                        (dur().seconds ?? 0) +
                        (props.startField === 'seconds' ? ((dur().days ?? 0) * 24*60*60 + (dur().hours ?? 0) * 60*60 + (dur().minutes ?? 0) * 60) : 0)
                    )
                }</span>
                <Show when={props.unit}><span class="unit">{ctx.locale().t('_i.timer.seconds')}</span></Show>
            </div>
        </Show>
    </div>;
}