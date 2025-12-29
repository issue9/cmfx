// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createTimer, Duration, ms, nano2IntlDuration, parseDuration } from '@cmfx/core';
import { Accessor, createMemo, createSignal, JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@/base';
import { useLocale } from '@/context';
import styles from './style.module.css';

export const fields = ['seconds', 'minutes', 'hours', 'days'] as const;

export type Field = typeof fields[number];

/**
 * 倒计时的计时器
 */
export interface Props extends BaseProps, RefProps<Ref> {
    /**
     * 时间段
     */
    duration: Duration;

    /**
     * 分隔符的内容
     */
    separator?: JSX.Element;

    /**
     * 需要显示的最小字段名称
     *
     * @remarks 默认为 minutes，即只显示分钟和秒数。
     * 当指定的单位无法全部显示指定的值时，大于此单位的数值会换算累加到该单位上。
     * 比如：当只指定了 seconds，但是表示分钟的值也不为空，则分钟会转换为秒数累加在秒之上。
     */
    startField?: Field;

    /**
     * 频率
     *
     * @remarks 最小单位为秒，负数为减少 duration，直到为零。正数为增加。
     * 默认为 -1。
     */
    interval?: number;

    /**
     * 是否自动开始倒计时
     */
    autoStart?: boolean;

    /**
     * 每一步倒计时触发的事件
     */
    onTick?: { (): void; };

    /**
     * 是否显示单位
     */
    unit?: boolean;

    /**
     * 完成时触发
     */
    onComplete?: { (): void; };
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

    root(): HTMLDivElement;
}

const minutesInDay = 24 * 60;
const secondsInDay = minutesInDay * 60;
const secondsInHour = 60 * 60;

/**
 * 计时组件
 */
export default function Timer(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const [dur, setDur] = createSignal<Intl.DurationInput>(nano2IntlDuration(parseDuration(props.duration)));

    let timer: Accessor<ReturnType<typeof createTimer>>;
    timer = createMemo(() => { // 监视 props.duration 和 props.interval 的变化
        if (timer) { timer().stop(); }

        return createTimer(parseDuration(props.duration) / ms, props.interval! * 1000, t => {
            setDur(nano2IntlDuration(t * ms));
            if (props.onTick) { props.onTick(); }
            if (t <= 0 && props.onComplete) { props.onComplete(); }
        });
    });

    if (props.autoStart) { onMount(() => timer().start()); }
    onCleanup(() => timer().stop());

    const l = useLocale();

    const format = (n: number): string => {
        const s = n.toString();
        return s.length < 2 ? s.padStart(2, '0') : s;
    };

    const getFieldIndex = (f: string) => {
        return fields.findIndex(num => num === f);
    };

    const startField = createMemo(() => {
        return getFieldIndex(props.startField!); // 由 mergeProps 决定 startField 必然存在。
    });

    return <div class={joinClass(props.palette, styles.timer, props.class)} style={props.style} ref={el => {
        if (props.ref) {
            props.ref({
                toggle() { timer().toggle(); },
                start() { timer().start(); },
                pause() { timer().pause(); },
                root() { return el; }
            });
        }
    }}>
        <Show when={startField() >= getFieldIndex('days')!}>
            <div class={styles.item}>
                <span class={styles.text}>{format(dur().days ?? 0)}</span>
                <Show when={props.unit}><span class={styles.unit}>{l.t('_c.timer.days')}</span></Show>
            </div>
            <div class={styles.sep}>{props.separator}</div>
        </Show>

        <Show when={startField() >= getFieldIndex('hours')!}>
            <div class={styles.item}>
                <span class={styles.text}>{
                    format((dur().hours ?? 0) + (props.startField! === 'hours' ? (dur().days ?? 0) * 24 : 0))
                }</span>
                <Show when={props.unit}><span class={styles.unit}>{l.t('_c.timer.hours')}</span></Show>
            </div>
            <div class={styles.sep}>{props.separator}</div>
        </Show>

        <Show when={startField() >= getFieldIndex('minutes')!}>
            <div class={styles.item}>
                <span class={styles.text}>{
                    format(
                        (dur().minutes ?? 0) +
                        (props.startField! === 'minutes' ? ((dur().days ?? 0) * minutesInDay + (dur().hours ?? 0) * 60) : 0)
                    )
                }</span>
                <Show when={props.unit}><span class={styles.unit}>{l.t('_c.timer.minutes')}</span></Show>
            </div>
            <div class={styles.sep}>{props.separator}</div>
        </Show>

        <Show when={startField() >= getFieldIndex('seconds')!}>
            <div class={styles.item}>
                <span class={styles.text}>{
                    format(
                        (dur().seconds ?? 0) +
                        (props.startField === 'seconds'
                            ? ((dur().days ?? 0) * secondsInDay + (dur().hours ?? 0) * secondsInHour + (dur().minutes ?? 0) * 60)
                            : 0)
                    )
                }</span>
                <Show when={props.unit}><span class={styles.unit}>{l.t('_c.timer.seconds')}</span></Show>
            </div>
        </Show>
    </div>;
}
