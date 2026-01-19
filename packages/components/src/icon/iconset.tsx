// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { bundleSvgsStringSync, easings, Rotation, rotations, SVGMorpheus } from '@iconsets/svg-morpheus-ts';
import { createEffect, createMemo, JSX, onMount } from 'solid-js';
import { template } from 'solid-js/web';

import { BaseProps, isReducedMotion, joinClass, RefProps, style2String } from '@components/base';
import { useTheme } from '@components/context';
import styles from './style.module.css';

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
     * @remarks 图标的顺序与 {@link Props#icons} 的顺序是相同的。
     */
    next(): void;

    /**
     * 显示上一个图标
     *
     * @remarks 图标的顺序与 {@link Props#icons} 的顺序是相同的。
     */
    prev(): void;

    /**
     * 组件的根元素
     */
    root(): SVGSVGElement;
}

export const iconSetRotations = rotations;

export const iconSetEasings = Object.keys(easings);

export interface Props extends BaseProps, RefProps<Ref> {
    /**
     * 图标集
     *
     * @remarks
     * 键名为图标的 ID，键值为图标实例；
     */
    icons: Record<string, JSX.Element>;

    /**
     * 显示的图标，如果未指定，则采用 {@link Props.icons} 中的最后一个。
     *
     * @reactive
     */
    value?: string;

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
}

/**
 * 提供多图标的切换效果
 *
 * @remarks
 * 可以一次性指定多个图标，通过 {@link Ref#to} 实现跳转到另一个图标且带有动画效果。
 * 应该尽量避免纯图标表示的状态切换，纯粹的图标很难告诉用户当前的图标是表示当前状态还是点击之后的状态。
 *
 * 会根据 `@media(prefers-reduced-motion: reduce)` 判断是否需要使用动画效果。
 */
export function IconSet(props: Props): JSX.Element {
    const keys = Object.keys(props.icons); // 图标名称列表
    let index = props.value ? keys.indexOf(props.value) : keys.length - 1; // 当前图标在 keys 中的索引
    const t = useTheme();

    const maps: Record<string, string> = {};
    Object.entries(props.icons).forEach(value => {
        maps[value[0]] = (value[1] as HTMLElement)?.outerHTML;
    });

    const el = bundleSvgsStringSync(maps, { style: style2String(props.style) });
    const icons = template(el)().cloneNode(true) as SVGSVGElement;

    let morpheus: SVGMorpheus;

    const getDuration = createMemo(() => isReducedMotion() ? 0 : t.scheme.transitionDuration);

    createEffect(() => { // 监视样式和主题变化
        icons.setAttribute('class', joinClass(props.palette, styles.iconset, props.class)!);
        icons.setAttribute('style', style2String(props.style));
    });

    createEffect(() => { // 监视 props.value
        const toid = props.value;
        if (morpheus && toid) { morpheus.to(toid, { duration: getDuration() }); }
    });

    onMount(() => {
        morpheus = new SVGMorpheus(icons, {
            iconId: props.value,
            duration: getDuration(),
            easing: props.easing,
            rotation: props.rotation,
            lite: true,
        }, () => {
            if (!props.ref) { return; }

            props.ref({
                to: (gid) => {
                    morpheus.to(gid, { duration: getDuration() });
                    index = keys.indexOf(gid);
                },

                next: () => {
                    index++;
                    if (index >= keys.length) { index = 0; }
                    morpheus.to(keys[index], { duration: getDuration() });
                },

                prev: () => {
                    index--;
                    if (index < 0) { index = keys.length - 1; }
                    morpheus.to(keys[index], { duration: getDuration() });
                },

                root: () => icons,
            });
        });

        morpheus.to(morpheus.currIconId(), { rotation: 'none' });
    });

    return <>{icons}</>;
}
