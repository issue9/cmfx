// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { bundleSvgsStringSync, easings, Rotation, rotations, SVGMorpheus } from '@iconsets/svg-morpheus-ts';
import { createEffect, JSX, onMount } from 'solid-js';
import { template } from 'solid-js/web';

import { BaseProps, joinClass, style2String, transitionDuration } from '@/base';
import { useTheme } from '@/context';

export interface Ref {
    /**
     * 跳转至新图标
     *
     * @param gid - 跳转至新图标的 ID，该值必须是图标集中的一个，如果不存在则不执行任何操作；
     */
    to(gid: string): void;

    /**
     * 显示下一个图标
     *
     * @remarks 图标的顺序与 {@link Props.icons} 的顺序是相同的。
     */
    next(): void;

    /**
     * 显示上一个图标
     *
     * @remarks 图标的顺序与 {@link Props.icons} 的顺序是相同的。
     */
    prev(): void;

    /**
     * 组件的根元素
     */
    element(): SVGSVGElement;
}

export const animationIconRotations = rotations;

export const animationIconEasings = Object.keys(easings);

export interface Props extends BaseProps {
    /**
     * 图标集
     *
     * @remarks
     * 键名为图标的 ID，键值为图标实例；
     */
    icons: Record<string, JSX.Element>;

    /**
     * 默认显示的图标，如果未指定，则采用 {@link Props.icons} 中的最后一个。
     */
    preset?: string;

    /**
     * 缓动函数
     *
     * @remarks
     * 如果需要自定义缓动函数，可以通过使用 {@link SVGMorpheus#registerEasing} 方法进行注册。
     */
    easing?: keyof typeof easings;

    /**
     * 旋转方式
     */
    rotation?: Rotation;

    ref: { (ref: Ref): void; };
}

/**
 * 提供多图标的动画切换效果
 *
 * @remarks
 * 可以一次性指定多个图标，通过 {@link Ref#to} 实现跳转到另一个图标且带有动画效果。
 * 应该尽量避免纯图标表示的状态切换，纯粹的图标很难告诉用户当前的图标是表示当前状态还是点击之后的状态。
 *
 * 图标的切换不会受到 `@media (prefers-reduced-motion: reduce)` 的影响。
 */
export function AnimationIcon(props: Props): JSX.Element {
    const keys = Object.keys(props.icons); // 图标名称列表
    let index = props.preset ? keys.indexOf(props.preset) : keys.length - 1; // 当前图标在 keys 中的索引

    const maps: Record<string, string> = {};
    Object.entries(props.icons).forEach(value => {
        maps[value[0]] = (value[1] as HTMLElement)?.outerHTML;
    });

    const el = bundleSvgsStringSync(maps, { style: '' });
    const icons = template(el)().cloneNode(true) as SVGSVGElement;

    const theme = useTheme();
    let morpheus: SVGMorpheus;

    createEffect(() => { // 监视样式和主题变化
        const mode = theme.mode; // 必须要单独调用 theme.mode，如果直接写在 if 条件语句中，无法监视到其变化。
        const scheme = theme.scheme;
        const cls = props.class;
        const p = props.palette;
        const style = props.style;

        if ((cls || p || mode || scheme)) {
            // 此处的 text-palette-fg! 必不可少的，如果不强制设置颜色，svg 的默认色可能是 currentColor。
            // 它会从父类查找颜色，如果父类设置了 :active 等伪类的颜色值，那么它可能获取的是伪类状态下的颜色。
            icons.setAttribute('class', joinClass(p, 'text-palette-fg!', 'w-4', cls)!);

            if (morpheus) { morpheus.to(morpheus.currIconId(), { rotation: 'none' }); }
        }

        if (style) {
            icons.setAttribute('style', style2String(style));

            if (morpheus) { morpheus.to(morpheus.currIconId(), { rotation: 'none' }); }
        }
    });

    onMount(() => {
        const dur = transitionDuration(icons);

        morpheus = new SVGMorpheus(icons, {
            iconId: props.preset,
            duration: dur,
            easing: props.easing,
            rotation: props.rotation,
        }, () => {
            props.ref({
                to: (gid) => {
                    morpheus.to(gid, { duration: dur });
                    index = keys.indexOf(gid);
                },

                next: () => {
                    index++;
                    if (index >= keys.length) { index = 0; }
                    morpheus.to(keys[index], { duration: dur });
                },

                prev: () => {
                    index--;
                    if (index < 0) { index = keys.length - 1; }
                    morpheus.to(keys[index], { duration: dur });
                },

                element: () => icons,
            });
        });
    });

    return <>{icons}</>;
}
