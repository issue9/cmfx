/*
 * SPDX-FileCopyrightText: 2025 caixw
 *
 * SPDX-License-Identifier: MIT
 */

import { createEffect, createSignal, onMount, JSX, mergeProps, onCleanup, Show } from 'solid-js';

import { BaseProps } from '@/components/base';
import { Duration,parseDuration, formatDuration, second } from '@/core';
import { useApp } from '@/components/context';

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
     * 是否显示全部的面，即使该项的值是零。
     */
    full?: boolean;

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
        return n.toString().padStart(2, '0');
    };

    return <div class={props.class} classList={{
        ...props.classList,
        'c--timer': true,
    }}>
        <Show when={props.full || dur().days}>
            <div class="item">
                <span class="text">{ format(dur().days ?? 0) }</span>
                <Show when={props.unit}><span class="unit">{ ctx.locale().t('_i.timer.days') }</span></Show>
            </div>
            <div class="sep">{props.separator}</div>
        </Show>

        <Show when={props.full || dur().hours}>
            <div class="item">
                <span class="text">{ format(dur().hours ?? 0) }</span>
                <Show when={props.unit}><span class="unit">{ ctx.locale().t('_i.timer.hours') }</span></Show>
            </div>
            <div class="sep">{props.separator}</div>
        </Show>

        <Show when={props.full || dur().minutes}>
            <div class="item">
                <span class="text">{ format(dur().minutes ?? 0) }</span>
                <Show when={props.unit}><span class="unit">{ ctx.locale().t('_i.timer.minutes') }</span></Show>
            </div>
            <div class="sep">{props.separator}</div>
        </Show>

        <Show when={props.full || dur().seconds}>
            <div class="item">
                <span class="text">{ format(dur().seconds ?? 0) }</span>
                <Show when={props.unit}><span class="unit">{ ctx.locale().t('_i.timer.seconds') }</span></Show>
            </div>
        </Show>
    </div>;
}