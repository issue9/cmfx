// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, JSX, mergeProps, splitProps } from 'solid-js';

import { RefProps } from '@/base';
import { Props as BaseProps, Chart, presetProps as presetBaseProps, ChartOption } from './chart';

export interface Ref<T extends object> {
    /**
     * 追加数据
     */
    append(...data: Array<T>): void;

    /**
     * 清空数据
     */
    clear(): void;
}

export interface Props<T extends object> extends Omit<BaseProps, 'o'>, RefProps<Ref<T>> {
    /**
     * X 轴的设置
     */
    xAxis: XAxis<T>;

    yAxis?: string;

    /**
     * 是否显示提示信息
     */
    tooltip?: boolean;

    /**
     * 是否显示每一系列数据的标题
     */
    legend?: 'left' | 'right' | 'center';

    /**
     * 对数据列的定义
     */
    series: Array<Series<T>>;

    /**
     * 选中的模式
     */
    selectedMode?: 'single' | 'multiple' | 'series' | boolean;

    /**
     * 展示的数据
     *
     * @remarks
     * 可通过 {@link Ref#append}，如果总量超过 {@link size}，最早的数据会被删除。
     */
    data: Array<T>;

    /**
    * 最大的数据量，当图表中的数据大于此值时，会删除顶部的数据。
    */
    size?: number;
}

export interface XAxis<T extends object> {
    /**
     * X 轴上的名称
     */
    name?: string;

    /**
     * 显示在 X 轴上的字段名
     */
    key: keyof T;
}

export interface Series<T extends object> {
    /**
     * 展示类型
     */
    type: 'bar' | 'line';

    /**
     * 该列对应的字段名
     */
    key: keyof T;

    /**
     * 如果为空，则采用 key 作为默认值。
     */
    name?: string;

    /**
     * 数值对应的坐标轴，默认为 0，即左侧的坐标轴。
     */
    yAxisIndex?: 0 | 1;

    /**
     * 拥有相同非空值的此属性，将显示一列上。
     */
    stack?: string;

    /**
     * 平滑的线段，仅对 type === 'line' 有效果
     */
    smooth?: boolean;

    /**
     * 显示填充区域，仅对 type === 'line' 有效果
     */
    area?: boolean;
}

const presetProps = {
    ...presetBaseProps,
} as const;

/**
 * 带坐标系的图表组件
 *
 * @typeParam T - 每一条数据的类型
 */
export function ChartAxis<T extends object>(props: Props<T>): JSX.Element {
    props = mergeProps(presetProps, props);
    const [_, charsProps] = splitProps(props, ['xAxis', 'data', 'size', 'tooltip', 'legend', 'series', 'ref']);

    const [data, setData] = createSignal<Array<T>>(props.data);

    if (props.ref) {
        props.ref({
            append(...data: Array<T>) {
                setData(prev => {
                    let d = [...prev, ...data];
                    if (props.size && (d.length > props.size)) {
                        d.splice(0, d.length - props.size);
                    }
                    return d;
                });
            },

            clear() { setData([]); }
        });
    }

    const axisLine = {lineStyle: { color: 'var(--palette-fg-low)' },};
    const splitLine = { lineStyle: { color: ['var(--palette-bg-low)'] } };

    const o = createMemo<ChartOption>(() => {
        const dimensions = [props.xAxis.key, ...props.series.map(s => s.key)] as Array<string>;

        const yAxis: ChartOption['yAxis'] = [{
            type: 'value', axisLine: axisLine, splitLine: splitLine, show: true, name: props.yAxis
        }];
        if (props.series.find(s => s.yAxisIndex === 1)) {
            yAxis.push({ type: 'value', axisLine: axisLine, splitLine: splitLine, show: true });
        }

        return {
            tooltip: { show: props.tooltip, textStyle: { color: 'var(--palette-fg)' }, backgroundColor: 'var(--palette-bg)' },
            legend: props.legend ? {
                show: !!props.legend,
                textStyle: { color: 'var(--palette-fg)' },
                left: props.legend,
            } : undefined,
            xAxis: {
                name: props.xAxis.name,
                type: 'category',
                axisLine: axisLine,
                splitLine: splitLine,
            },
            yAxis: yAxis,
            series: props.series.map(s => {
                return {
                    name: s.name ?? s.type,
                    type: s.type,
                    yAxisIndex: s.yAxisIndex,
                    symbol: 'circle',
                    symbolSize: 8,
                    selectedMode: props.selectedMode,
                    stack: s.stack,
                    smooth: s.smooth,
                    areaStyle: s.area ? {} : undefined,
                };
            }),
            dataset: {
                dimensions: dimensions,
                source: data(),
            }
        };
    });

    return <Chart o={o()} {...charsProps} />;
}
