// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { AnimationIcon, AnimationIconRef, Button, Code, joinClass, ThemeProvider } from '@cmfx/components';
import { createSignal, JSX, Show } from 'solid-js';
import IconCode from '~icons/material-symbols/code-rounded';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLTR from '~icons/ooui/text-flow-ltr';
import IconRTL from '~icons/ooui/text-flow-rtl';

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
}

/**
 * 用于展示组件的舞台
 */
export default function Stage(props: Props) {
    const [mode, setMode] = createSignal<'light' | 'dark'>('light');
    const [code, setCode] = createSignal(false);
    const [dir, setDir] = createSignal<'ltr' | 'rtl'>('ltr');
    let rtlAnimation: AnimationIconRef;

    return <fieldset class={styles.stage}>
        <Show when={props.title}>{title => <legend>{title()}</legend>}</Show>

        <Show when={props.desc}>{desc =>
            <div class={styles.desc}>{desc()}</div>
        }</Show>

        <ThemeProvider mode={mode()}>
            <div class={styles.component} dir={dir()}>{props.component}</div>
        </ThemeProvider>

        <div class={joinClass(styles.toolbar, code() ? undefined : '!border-b-transparent')}>
            <Button square onClick={() => {
                setDir(dir() === 'ltr' ? 'rtl' : 'ltr');
                rtlAnimation.to(dir() === 'rtl' ? 'rtl' : 'ltr');
            }}>
                <AnimationIcon class='aspect-square w-4' rotation='clock' ref={el => rtlAnimation = el} preset='ltr' icons={{
                    rtl: IconRTL,
                    ltr: IconLTR,
                }} />
            </Button>

            <Button square checked={mode() === 'dark'} onClick={() => {
                setMode(mode() === 'light' ? 'dark' : 'light');
            }}><IconDark /></Button>

            <Show when={props.source}>
                <Button square checked={code()} onClick={() => { setCode(!code()); }}><IconCode /></Button>
            </Show>
        </div>

        <Show when={props.source}>
            <Code lang='tsx' class={joinClass(styles.code, code() ? 'block' : 'hidden')}>
                {props.source}
            </Code>
        </Show>
    </fieldset>;
}
