// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, JSX, mergeProps, splitProps } from 'solid-js';

import { Props as BaseProps, Chart, presetProps as presetBaseProps, ChartOption } from './chart';

export interface Props extends Omit<BaseProps, 'initValue' | 'ref'> {
    /**
     * 是否显示提示信息
     */
    tooltip?: boolean;

    /**
     * 是否显示每一系列数据的标题
     */
    legend?: 'left' | 'right' | 'center';

    /**
     * 间隔的角度
     */
    padding?: number;

    /**
     * 半径，0-75% 或是表示像素的数值
     */
    radius?: number | string | (number|string)[];

    /**
     * 南丁格尔玫瑰图
     */
    roseType?: 'radius' | 'area';

    /**
     * 圆角
     */
    borderRadius?: string | number;

    /**
     * 选中的模式
     */
    selectedMode?: 'single' | 'multiple' | 'series' | boolean;

    /**
     * 展示的数据
     */
    initValue: Array<{name: string, value: number, selected?: boolean}>;
}

const presetProps = {
    padding: 0,
    radius: '50%',
    ...presetBaseProps,
};

/**
 * 带坐标系的图表组件
 */
export function ChartPie(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [_, charsProps] = splitProps(props, ['initValue', 'tooltip', 'legend', 'padding', 'radius']);

    const o = createMemo(() => {
        const o: ChartOption = {
            tooltip: { show: props.tooltip, textStyle: { color: 'var(--palette-fg)' }, backgroundColor: 'var(--palette-bg)', trigger: 'item' },
            legend: props.legend ? {
                show: !!props.legend,
                textStyle: { color: 'var(--palette-fg)' },
                orient: props.legend === 'center' ? 'horizontal' : 'vertical',
                left: props.legend,
            } : undefined,
            series: {
                padAngle: props.padding,
                selectedMode: props.selectedMode,
                radius: props.radius,
                type: 'pie',
                roseType: props.roseType,
                itemStyle: props.borderRadius ? {
                    borderRadius: props.borderRadius
                } : undefined,
                label: {
                    color: 'var(--palette-fg)'
                }
            },
            dataset: {
                source: props.initValue,
            }
        };
        return o;
    });

    return <Chart initValue={o()} {...charsProps} />;
}
