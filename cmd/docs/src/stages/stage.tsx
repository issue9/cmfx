// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, Code, joinClass, Layout, ThemeProvider, ToggleFitScreenButton } from '@cmfx/components';
import { createEffect, createSignal, JSX, mergeProps, Show } from 'solid-js';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLTR from '~icons/material-symbols/format-align-left-rounded';
import IconRTL from '~icons/material-symbols/format-align-right-rounded';
import IconLight from '~icons/material-symbols/light-mode';

import styles from './style.module.css';

export interface Props {
    /**
     * 组件的源代码
     */
    source: string;

    /**
     * 源代码对应的组件
     */
    component: JSX.Element;

    /**
     * 标题
     */
    title?: JSX.Element;

    /**
     * 对当前演示代码的描述
     */
    desc?: JSX.Element;

    /**
     * 组件内的演示内容高度
     */
    height?: number;

    layout?: Layout;
}

/**
 * 用于展示组件的舞台
 */
export default function Stage(props: Props) {
    props = mergeProps({ layout: 'horizontal' as Layout }, props);

    const initDir = window.getComputedStyle(document.body).direction === 'rtl' ? 'rtl' : 'ltr';
    const [dir, setDir] = createSignal<'ltr' | 'rtl'>(initDir);
    const [mode, setMode] = createSignal<'light' | 'dark'>('light');

    const [demoRef, setDemoRef] = createSignal<HTMLDivElement>();
    const [stageRef, setStageRef] = createSignal<HTMLDivElement>();
    createEffect(() => {
        if (props.layout === 'vertical') { return; }

        if (demoRef() && stageRef()) {
            requestIdleCallback(() => {
                // 4 可以让实际的演示内容与底部的工具栏之间有一定的空隙
                stageRef()!.style.height = (demoRef()!.offsetHeight + 4) + 'px';
            });
        }
    });

    return <>
        <Show when={props.title}>{title => <h4>{title()}</h4>}</Show>

        <Show when={props.desc}>{desc =>
            <article class={styles.desc}>{desc()}</article>
        }</Show>

        <div class={joinClass(undefined, styles.stage, props.layout === 'vertical' ? styles.vertical : '')} ref={setStageRef}>
            <div class={styles.demo} ref={setDemoRef}
                style={{ height: typeof props.height === 'number' ? `${props.height}px` : props.height }}
            >
                <div class={styles.toolbar}>
                    <ButtonGroup>
                        <Button square checked={dir() === 'rtl'} onclick={() => { setDir('rtl'); }}>
                            <IconRTL />
                        </Button>
                        <Button square checked={dir() === 'ltr'} onclick={() => { setDir('ltr'); }}>
                            <IconLTR />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup>
                        <Button square checked={mode() === 'dark'} onclick={() => { setMode('dark'); }}>
                            <IconDark />
                        </Button>
                        <Button square checked={mode() === 'light'} onclick={() => { setMode('light'); }}>
                            <IconLight />
                        </Button>
                    </ButtonGroup>

                    <ToggleFitScreenButton square container={demoRef()!} />
                </div>

                <ThemeProvider mode={mode()}>
                    <div class={styles.component} dir={dir()}>{props.component}</div>
                </ThemeProvider>
            </div>

            <Show when={props.source}>
                <Code wrap ln={0} lang='tsx' class={styles.code}>{props.source}</Code>
            </Show>
        </div>
    </>;
}
