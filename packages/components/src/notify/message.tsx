// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createTimer, sleep } from '@cmfx/core';
import { createMemo, createUniqueId, JSX, Match, mergeProps, onCleanup, onMount, Show, Switch } from 'solid-js';
import IconError from '~icons/flowbite/close-circle-solid';
import IconSuccess from '~icons/material-symbols/check-circle-rounded';
import IconClose from '~icons/material-symbols/close';
import IconWarning from '~icons/material-symbols/error-rounded';
import IconInfo from '~icons/material-symbols/info-rounded';

import { BaseProps, joinClass, Palette } from '@/base';
import styles from './style.module.css';

export const types = ['error', 'warning', 'success', 'info'] as const;

export type Type = typeof types[number];

const type2Palette: ReadonlyMap<Type, Palette> = new Map<Type, Palette>([
    ['error', 'error'],
    ['warning', 'tertiary'],
    ['success', 'primary'],
    ['info', 'secondary'],
]);

export interface Props extends BaseProps {
    /**
     * 显示的图标
     *
     * @remarks
     * 如果未指定，则根据 type 自动选择图标。若不想显示图标，可以将此值指定为 false。
     */
    icon?: JSX.Element | false;

    /**
     * 标题
     *
     * @reactive
     */
    title: string;

    /**
     * 内容
     *
     * @reactive
     *
     * @remarks
     * 为了与 Notification 组件保持一致，如果需要换行，需要使用 `\n`，不支持 HTML 标签。
     */
    body?: string;

    /**
     * 持续时间，单位毫秒。
     *
     * @reactive
     */
    duration?: number;

    /**
     * 警告的类型
     *
     * @reactive
     * @defaultValue 'info'
     *
     * @remarks
     * 该值最终是调整了 {@link palette} 属性，如果 type 与 palette 存在冲突，则以 type 为准。
     */
    type?: Type;

    // 指定动画时间，因为在 notify 中使用了 render 渲染到 Portal 中，无法使用 useTheme 获取动画时长。
    transitionDuration: number;

    /**
     * 是否带关闭按钮
     *
     * @reactive
     */
    closable?: boolean;
}

/**
 * 信息框，notify 和 alert 的共用组件
 */
export function Message(props: Props): JSX.Element {
    props = mergeProps({ type: 'info' as Type }, props);

    let rootRef: HTMLDivElement;
    let buttonRef: HTMLButtonElement;

    const del = async () => {
        if (!props.transitionDuration) { return; }

        rootRef.style.height = '0';
        await sleep(props.transitionDuration); // 待动画结束
        rootRef.remove();
    };

    onMount(() => {
        const h = rootRef.getBoundingClientRect().height;
        rootRef.style.height = `${h}px`; // 只有明确的高度，transition 动画才能触发。

        if (props.duration) {
            const timeout = props.duration;
            const timer = createTimer(timeout, -100, (t: number) => {
                const p = (timeout - t) / timeout * 100;
                buttonRef.style.background = `conic-gradient(var(--palette-bg-low) 0% ${p}%, var(--palette-bg-high) ${p}% 100%)`;
                if (t <= 0) { del(); }
            });
            timer.start();

            rootRef.addEventListener('mouseover', timer.pause);
            rootRef.addEventListener('mouseout', timer.start);

            onCleanup(() => {
                rootRef.removeEventListener('mouseover', timer.pause);
                rootRef.removeEventListener('mouseout', timer.start);
                timer.stop();
            });
        }
    });

    const cls = createMemo(() => {
        return joinClass(props.type ? type2Palette.get(props.type) : props.palette, styles.message, props.class);
    });

    const titleID = createUniqueId();
    const contentID = createUniqueId();

    /* 保证 left 的图标与标题对齐 */
    let leftRef: HTMLDivElement;
    let labelRef: HTMLDivElement;
    const ob = new ResizeObserver(entries => {
        leftRef.style.height = entries[0]!.borderBoxSize[0].blockSize.toString() + 'px';
    });
    onMount(() => { ob.observe(labelRef); });
    onCleanup(() => ob.disconnect());

    return <div ref={el => rootRef = el} class={cls()} style={props.style}
        role="alert" aria-labelledby={titleID} aria-describedby={props.body ? contentID : undefined}
    >
        <div class={styles.left} aria-hidden="true" ref={el => leftRef = el}>
            <Show when={props.icon !== false}>
                <Switch>
                    <Match when={props.icon}>{c => c()}</Match>
                    <Match when={props.type === 'error'}><IconError /></Match>
                    <Match when={props.type === 'warning'}><IconWarning /></Match>
                    <Match when={props.type === 'success'}><IconSuccess /></Match>
                    <Match when={props.type === 'info'}><IconInfo /></Match>
                </Switch>
            </Show>
        </div>

        <div class={styles.right}>
            <div class={styles.label} ref={el => labelRef = el}>
                <p id={titleID}>{props.title}</p>
                <Show when={props.closable}>
                    <button class={styles['close-wrap']} ref={el => buttonRef = el}>
                        <IconClose onClick={del} class={styles.close} />
                    </button>
                </Show>
            </div>

            <Show when={props.body}>
                {c => <div id={contentID} class={styles.body} innerHTML={c().replace(/\\n/g, '<br />')} />}
            </Show>
        </div>
    </div>;
}
