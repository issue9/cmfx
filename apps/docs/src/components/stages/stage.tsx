// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, ButtonGroup, Code, joinClass, MountProps, Layout, ThemeProvider, ToggleFitScreenButton,
} from '@cmfx/components';
import { Component, createMemo, createSignal, JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';
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
     *
     * @remarks 该组件可以接受一个 {@link MountProps} 类型作为组件的属性列表。
     * 组件内可以通过 {@link MountProps.mount} 将设置项添加到工具栏上。
     */
    component: Component<MountProps>;

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
    height?: JSX.CSSProperties['height'];

    /**
     * 整个演示对象的布局
     */
    layout?: Layout | 'auto';
}

/**
 * 用于展示组件的舞台
 */
export default function Stage(props: Props) {
    props = mergeProps({ layout: 'auto' as Layout }, props);

    const initDir = window.getComputedStyle(document.body).direction === 'rtl' ? 'rtl' : 'ltr';
    const [dir, setDir] = createSignal<'ltr' | 'rtl'>(initDir);
    const [mode, setMode] = createSignal<'light' | 'dark'>('light');

    const [demoRef, setDemoRef] = createSignal<HTMLDivElement>();
    const [codeHeight, setCodeHeight] = createSignal<string>();

    onMount(()=>{
        const ro = new ResizeObserver(entries => {
            setCodeHeight(entries[0]!.borderBoxSize[0].blockSize.toString() + 'px');
        });
        ro.observe(demoRef()!);

        onCleanup(() => ro.disconnect());
    });

    const stageCls = createMemo(()=>{
        return joinClass(
            undefined,
            styles.stage,
            props.layout === 'auto' ? styles.auto : (props.layout === 'vertical' ? styles.vertical : ''),
        );
    });

    let settingRef: HTMLElement;

    return <>
        <Show when={props.title}>{title => <h4>{title()}</h4>}</Show>

        <Show when={props.desc}>{desc =>
            <article class={styles.desc}>{desc()}</article>
        }</Show>

        <div class={stageCls()}>
            <div class={styles.demo} ref={setDemoRef} style={{ height: props.height }}>
                <div class={styles.toolbar}>
                    <div class={styles.left}>
                        <ToggleFitScreenButton square container={demoRef()!} />

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
                    </div>

                    <div class={styles.right} ref={el => settingRef = el} />
                </div>

                <ThemeProvider mode={mode()}>
                    <div dir={dir()} class={joinClass(undefined, styles.component)}>
                        {props.component({ mount: settingRef! })}
                    </div>
                </ThemeProvider>
            </div>

            <Show when={props.source}>
                {s => <Code wrap ln={0} lang='tsx' class={styles.code} style={{height: codeHeight()}}>{s()}</Code>}
            </Show>
        </div>
    </>;
}
