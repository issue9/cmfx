// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { AnimationIcon, AnimationIconRef, Button, Code, joinClass, ThemeProvider } from '@cmfx/components';
import { createSignal, JSX, Show } from 'solid-js';
import IconCode from '~icons/material-symbols/code-rounded';
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
}

/**
 * 用于展示组件的舞台
 */
export default function Stage(props: Props) {
    const [code, setCode] = createSignal(false);

    const initDir = window.getComputedStyle(document.body).direction === 'rtl' ? 'rtl' : 'ltr';
    const [dir, setDir] = createSignal<'ltr' | 'rtl'>(initDir);
    let rtlAnimation: AnimationIconRef;

    const initMode = 'light';
    const [mode, setMode] = createSignal<'light' | 'dark'>(initMode);
    let modeAnimation: AnimationIconRef;

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
                rtlAnimation.to(dir());
            }}>
                <AnimationIcon class='aspect-square w-4' rotation='clock' ref={el => rtlAnimation = el} preset={initDir} icons={{
                    rtl: IconRTL,
                    ltr: IconLTR,
                }} />
            </Button>

            <Button square onClick={() => {
                setMode(mode() === 'light' ? 'dark' : 'light');
                modeAnimation.to(mode());
            }}>
                <AnimationIcon class='aspect-square w-4' rotation='clock' ref={el => modeAnimation = el} preset={initMode} icons={{
                    dark: IconDark,
                    light: IconLight,
                }} />
            </Button>

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
