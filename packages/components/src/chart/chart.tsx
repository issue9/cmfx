// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import * as echarts from 'echarts';
import { createEffect, JSX, mergeProps, onCleanup, onMount } from 'solid-js';

import { BaseProps, isReducedMotion, joinClass, transitionDuration } from '@/base';
import { useLocale } from '@/context';
import { matchLocale } from './locale';

export type ChartOption = echarts.EChartsOption;

export interface Props extends BaseProps {
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
     * 图表的配置项
     *
     * NOTE: o 中各种颜色值可以引用 CSS 的变量：var(--palette-bg) 等以适应主题的变化。
     * @reactive
     */
    o: ChartOption;
}

export const presetProps: Readonly<Partial<Props>> = {
    useCoarsePointer: false,
    height: 300,
    width: 300
};

/**
 * echarts 组件
 *
 * @remarks
 * echarts 的 setOption 函数映射到 {@link Props#o} 属性，更新 o 属性相当于调用 setOption 方法。
 * {@link echarts#init} 的各个参数则由组件的其它属性组成，都是非响应式的。
 */
export function Chart(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    let ref: HTMLDivElement;
    let inst: echarts.ECharts;

    const resize = () => { inst.resize(); };

    onMount(() => {
        const theme = {
            /*
             * TODO: https://github.com/apache/echarts/issues/20757
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

        window.addEventListener('resize', resize);
    });

    onCleanup(() => {
        inst.dispose();
        window.removeEventListener('resize', resize);
    });

    createEffect(() => { // 监视 props.o 变化
        // TODO: getMode()
        props.o.animation = !!isReducedMotion();
        props.o.animationDuration = transitionDuration(ref);
        inst.setOption(props.o);
    });

    return <div class={joinClass(props.palette, props.class)} ref={el => ref = el} style={props.style} />;
}
