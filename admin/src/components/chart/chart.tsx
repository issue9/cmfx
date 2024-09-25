// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as echarts from 'echarts';
import { RendererType } from 'echarts/types/src/util/types.js';
import { createEffect, mergeProps, onCleanup, onMount } from 'solid-js';

import { BaseProps } from '@/components/base';

export interface Props extends BaseProps {
    /**
     * 设备像素比
     *
     * 这是一个非响应式的属性
     */
    devicePixelRatio?: number;

    /**
     * 渲染方式，默认为 svg。
     *
     * 这是一个非响应式的属性
     */
    renderer?: RendererType;

    /**
     * 是否开启脏矩形渲染，只有在 Canvas 渲染模式有效
     *
     * 这是一个非响应式的属性
     */
    useDirtyRect?: boolean;

    /**
     * 是否扩大可点击元素的响应范围。null 表示对移动设备开启；true 表示总是开启；false 表示总是不开启。
     *
     * 这是一个非响应式的属性
     */
    useCoarsePointer?: boolean;

    /**
     * 扩大元素响应范围的像素大小
     *
     * 这是一个非响应式的属性
     */
    pointerSize?: number;

    /**
     * 可显式指定实例高度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取容器的高度。
     *
     * 这是一个非响应式的属性
     */
    height?: number | string;

    /**
     * 可显式指定实例宽度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取容器的宽度。
     *
     * 这是一个非响应式的属性
     */
    width?: number | string;

    /**
     * 图表的配置项
     *
     * NOTE: 如果当前组件中设置了 palette 属性，那么此属性中的 backgroundColor 和 color 将不起作用。
     */
    o: echarts.EChartsOption;
}

export const presetProps: Readonly<Partial<Props>> = {
    devicePixelRatio: window.devicePixelRatio,
    renderer: 'svg',
    useDirtyRect: false,
    useCoarsePointer: false,
    height: 300,
    width: 300
};

export default function(props: Props) {
    props = mergeProps(presetProps, props);

    let ref: HTMLDivElement | HTMLCanvasElement;
    let inst: echarts.ECharts;

    onMount(() => {
        inst = echarts.init(ref, null, {
            // TODO locale
            height: props.height,
            width: props.width,
            renderer: props.renderer,
        });
    });

    onCleanup(() => {
        inst.dispose();
    });

    const getColor = (v: string) => { // 为了兼容 Canvas
        return window.getComputedStyle(ref).getPropertyValue(v);
    };
    createEffect(() => {
        const o = {
            ...props.o,
            backgroundColor: getColor('--bg'),
            color: [getColor('--fg'), getColor('--fg-low'), getColor('--fg-high'), getColor('--bg-low'), getColor('--bg-high')]
        };
        inst.setOption(o);
    });

    if (props.renderer === 'svg') {
        return <div class={props.palette ? `palette--${props.palette}` : ''} ref={el => ref = el}></div>;
    }
    return <canvas class={props.palette ? `palette--${props.palette}` : ''} ref={el => ref = el}></canvas>;
}
