// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import * as echarts from 'echarts';
import { createEffect, JSX, mergeProps, on, onCleanup, onMount } from 'solid-js';

import { BaseProps, isReducedMotion, joinClass, RefProps } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import { matchLocale } from './locale';

export type ChartOption = echarts.EChartsOption;

export interface Ref {
    /**
     * 返回 echarts 的操作实例
     */
    echarts(): echarts.ECharts;

    /**
     * 组件根元素
     */
    root(): HTMLDivElement;

    /**
     * 更新图表数据
     * @param o - 新的图表数据
     */
    update(o: ChartOption): void;
}

export interface Props extends BaseProps, RefProps<Ref> {
    /**
     * 是否扩大可点击元素的响应范围
     *
     * @remarks
     *  - null 表示对移动设备开启；
     *  - true 表示总是开启；
     *  - false 表示总是不开启。
     */
    useCoarsePointer?: boolean;

    /**
     * 扩大元素响应范围的像素大小
     */
    pointerSize?: number;

    /**
     * 可显式指定实例高度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取容器的高度。
     */
    height?: number | string;

    /**
     * 可显式指定实例宽度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取容器的宽度。
     */
    width?: number | string;

    /**
     * 图表的初始数据
     */
    initValue: ChartOption;
}

export const presetProps: Readonly<Partial<Props>> = {
    useCoarsePointer: false,
    height: 300,
    width: 300
};

/**
 * echarts 组件
 */
export function Chart(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [opt] = useOptions();
    const l = useLocale();

    let ref: HTMLDivElement;
    let inst: echarts.ECharts;

    const resize = () => { inst.resize(); };

    onMount(() => {
        const theme = {
            // TODO: https://github.com/apache/echarts/issues/20757
            // TODO: https://github.com/apache/echarts/issues/19976
            /*
            color: [
                'var(--palette-2-bg)', 'var(--palette-2-fg)', 'var(--palette-3-bg)', 'var(--palette-3-fg)',
                'var(--palette-4-bg)', 'var(--palette-4-fg)', 'var(--palette-5-bg)', 'var(--palette-5-fg)',
            ],
            */
        };

        inst = echarts.init(ref, theme, {
            locale: matchLocale(l.locale.toString()),
            height: props.height,
            width: props.width,
            renderer: 'svg',
        });

        // 初始数据
        inst.setOption({
            animation: !isReducedMotion(),
            animationDuration: opt.getTransitionDuration(),
            ...props.initValue,
        });

        window.addEventListener('resize', resize);
    });

    onCleanup(() => {
        inst.dispose();
        window.removeEventListener('resize', resize);
    });

    createEffect(on(isReducedMotion, () => {
        inst.setOption({ animation: !isReducedMotion() });
    }));

    return <div class={joinClass(props.palette, props.class)} style={props.style} ref={el => {
        ref = el;
        if (props.ref) {
            props.ref({
                root() { return el; },
                echarts() { return inst; },
                update(o: ChartOption) { inst.setOption(o); }
            });
        }
    }} />;
}
