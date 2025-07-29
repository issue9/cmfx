// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, createUniqueId, JSX, onMount } from 'solid-js';
import { template } from 'solid-js/web';
import { bundleSvgsString, SVGMorpheus } from 'svg-morpheus-ts';

import { BaseProps, transitionDuration } from '@/base';
import { IconComponent } from './icon';

export interface Ref {
    /**
     * 跳转至新图标
     *
     * @param gid 跳转至新图标的 ID，该值必须是图标集中的一个，如果不存在则不执行任何操作；
     */
    to(gid: string): void;
}

/**
 * 可用的旋转方式
 */
export const animationIconRotations = ['clock', 'counterclock', 'none', 'random'] as const;

/**
 * 动画图标的旋转方式
 */
export type AnimationIconRotation = typeof animationIconRotations[number];

export interface Props extends BaseProps {
    /**
     * 图标集
     *
     * 键名为图标的 ID；
     * 键值为图标实例；
     *
     * NOTE: 非响应属性
     */
    icons: Record<string, IconComponent>;

    /**
     * 默认显示的图标，如果未指定，则采用 {@link Props#icons} 中的最后一个。
     *
     * NOTE: 非响应属性
     */
    preset?: string;

    /**
     * 缓动函数
     *
     * 如果需要自定义缓动函数，可以通过 svg-morpheus-ts 包使用 {@link SVGMorpheus#registerEasing} 方法进行注册。
     *
     * NOTE: 非响应属性
     */
    easing?: string;

    /**
     * 旋转方式
     *
     * NOTE: 非响应属性
     */
    rotation?: AnimationIconRotation;

    ref: { (ref: Ref): void; };

    class?: string;
}

/**
 * 动画图标
 *
 * 可以一次性指定多个图标，通过 {@link Ref#to} 实现跳转到另一个图标且带有动画效果。
 */
export function AnimationIcon(props: Props): JSX.Element {
    const [icons, setIcons] = createSignal<SVGSVGElement>();
    const id = createUniqueId();

    createEffect(async () => {
        const maps: Record<string, string> = {};

        Object.entries(props.icons).forEach((value) => {
            maps[value[0]] = (value[1]({}) as HTMLElement)?.outerHTML;
        });

        const el = await bundleSvgsString(maps, { id, style: '' });
        const svg = template(el)().cloneNode(true) as SVGSVGElement;
        if (props.class) { svg.setAttribute('class', props.class); }
        setIcons(svg);
    });

    onMount(() => {
        requestIdleCallback(() => {
            const m = new SVGMorpheus('#' + icons()?.id, {
                iconId: props.preset,
                duration: transitionDuration(300),
                easing: props.easing,
                rotation: props.rotation,
            }, ()=>{
                props.ref({
                    to: (gid) => { m.to(gid); }
                });
            });
        });
    });

    return <>{icons()}</>;
}
