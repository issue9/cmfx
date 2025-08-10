// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { bundleSvgsString, easings, Rotation, rotations, SVGMorpheus } from '@iconsets/svg-morpheus-ts';
import { createEffect, createResource, createUniqueId, JSX } from 'solid-js';
import { template } from 'solid-js/web';

import { BaseProps, joinClass, transitionDuration } from '@/base';
import { IconComponent } from './icon';

export interface Ref {
    /**
     * 跳转至新图标
     *
     * @param gid 跳转至新图标的 ID，该值必须是图标集中的一个，如果不存在则不执行任何操作；
     */
    to(gid: string): void;
}

export const animationIconRotations = rotations;

export const animationIconEasings = Object.keys(easings);

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
    easing?: keyof typeof easings;

    /**
     * 旋转方式
     *
     * NOTE: 非响应属性
     */
    rotation?: Rotation;

    ref: { (ref: Ref): void; };
}

/**
 * 动画图标
 *
 * 可以一次性指定多个图标，通过 {@link Ref#to} 实现跳转到另一个图标且带有动画效果。
 */
export function AnimationIcon(props: Props): JSX.Element {
    const id = createUniqueId();
    let m: SVGMorpheus;

    const [icons] = createResource(async () => { // 主要是为了 await 功能
        const maps: Record<string, string> = {};

        Object.entries(props.icons).forEach(value => {
            maps[value[0]] = (value[1]({}) as HTMLElement)?.outerHTML;
        });

        const el = await bundleSvgsString(maps, { id, style: '' });
        return template(el)().cloneNode(true) as SVGSVGElement;
    });

    createEffect(() => {
        if ((props.class || props.palette) && !icons.loading) {
            const cls = joinClass(props.palette ? `palette--${props.palette}` : '', props.class);
            icons()!.setAttribute('class', cls!);

            // 如果更新了样式，调用 to 以同步更新样式。
            if (m) { m.to(m.currIconId()); }
        }
    });

    createEffect(() => { // 保证在创建组件之后执行
        requestIdleCallback(() => {
            m = new SVGMorpheus('#' + icons()?.id, {
                iconId: props.preset,
                duration: transitionDuration(300),
                easing: props.easing,
                rotation: props.rotation,
            }, () => {
                props.ref({
                    to: (gid) => { m.to(gid); }
                });
            });
        });
    });

    return <>{icons()}</>;
}
