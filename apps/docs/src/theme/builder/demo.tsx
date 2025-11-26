// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    fieldAccessor, Appbar, BasicTable, Button, ButtonGroup, Card, Column, DatePanel, Form, FormAccessor, joinClass,
    Menu, Mode, ObjectAccessor, Palette, palettes, Password, Scheme, TextField, ThemeProvider, useLocale, wcag
} from '@cmfx/components';
import { ExpandType } from '@cmfx/core';
import { createSignal, createEffect, For, JSX, Match, Switch } from 'solid-js';
import IconLess from '~icons/zondicons/minus-outline';
import IconMore from '~icons/zondicons/add-outline';
import IconNone from '~icons/ic/round-contrast';
import IconComponents from '~icons/material-symbols/widget-medium-rounded';
import IconPalettes from '~icons/material-symbols/palette';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLight from '~icons/material-symbols/light-mode';

import styles from './style.module.css';

type Contrast = 'more' | 'less' | 'none';

// 参考 tailwind.css 中的设置
const contrasts: ReadonlyMap<Contrast, Record<string, string>> = new Map([
    ['more', { '--contrast': '100%', '--opacity': '.7' }],
    ['less', { '--contrast': '80%', '--opacity': '.3' }],
    ['none', { '--contrast': '90%', '--opacity': '.5' }],
]);

/**
 * 组件演示
 */
export function Demo(props: { s: ObjectAccessor<ExpandType<Scheme>> }): JSX.Element {
    const l = useLocale();

    const [contrast, setContrast] = createSignal<Contrast>('none');
    const [typ, setTyp] = createSignal<'components' | 'palettes'>('components');
    const mode = fieldAccessor<Mode>('mode', 'light');

    // NOTE: 此处的 ThemeProvider 必须包含在 div 中，否则当处于 Transition 元素中时，
    // 快速多次地调整 ThemeProvider 参数可能会导致元素消失失败，main 中同时出现在多个元素。
    return <div class={styles.main}>
        <ThemeProvider mode={mode.getValue()} scheme={props.s.store()}>
            <div class={styles.demo} style={{ ...contrasts.get(contrast()) }}>
                <Appbar title={typ() === 'components' ? l.t('_d.theme.components') : l.t('_d.theme.palettes')}
                    class={styles.appbar} actions={
                        <>
                            <ButtonGroup>
                                <Button square checked={typ() === 'components'} title={l.t('_d.theme.components')}
                                    onclick={() => setTyp('components')}
                                ><IconComponents /></Button>

                                <Button square checked={typ() === 'palettes'} title={l.t('_d.theme.palettes')}
                                    onclick={() => setTyp('palettes')}
                                ><IconPalettes /></Button>
                            </ButtonGroup>

                            <ButtonGroup>
                                <Button square title={l.t('_d.theme.light')}
                                    checked={mode.getValue() === 'light'} onclick={() => mode.setValue('light')}>
                                    <IconLight />
                                </Button>
                                <Button square title={l.t('_d.theme.dark')}
                                    checked={mode.getValue() === 'dark'} onclick={() => mode.setValue('dark')}>
                                    <IconDark />
                                </Button>
                            </ButtonGroup>

                            <ButtonGroup>
                                <Button checked={contrast() === 'more'} square title={l.t('_d.theme.contrastMore')}
                                    onclick={() => setContrast('more')}
                                ><IconMore /></Button>

                                <Button checked={contrast() === 'none'} square title={l.t('_d.theme.contrastNone')}
                                    onclick={() => setContrast('none')}
                                ><IconNone /></Button>

                                <Button checked={contrast() === 'less'} square title={l.t('_d.theme.contrastLess')}
                                    onclick={() => setContrast('less')}
                                ><IconLess /></Button>
                            </ButtonGroup>
                        </>
                    } />
                <div class={styles.content}>
                    <Switch>
                        <Match when={typ() === 'components'}><Components /></Match>
                        <Match when={typ() === 'palettes'}><Palettes s={props.s} c={contrast()} /></Match>
                    </Switch>
                </div>
            </div>
        </ThemeProvider>
    </div>;
}

function Palettes(props: {s:ObjectAccessor<ExpandType<Scheme>>, c: Contrast}): JSX.Element {
    return <div class={styles.palettes}>
        <For each={palettes}>
            {p => <PaletteBlocks p={p} s={props.s} c={props.c} />}
        </For>
    </div>;
}

function PaletteBlocks(props: { p: Palette, s: ObjectAccessor<ExpandType<Scheme>>, c: Contrast }): JSX.Element {
    const raw = props.s.store();

    let baseRef: HTMLDivElement;
    let lowRef: HTMLDivElement;
    let highRef: HTMLDivElement;
    let disabledRef: HTMLDivElement;
    let focusedRef: HTMLDivElement;
    let activedRef: HTMLDivElement;
    let selectedRef: HTMLDivElement;
    const [baseWCAG, setBaseWCAG] = createSignal('');
    const [lowWCAG, setLowWCAG] = createSignal('');
    const [highWCAG, setHighWCAG] = createSignal('');
    const [disabledWCAG, setDisabledWCAG] = createSignal('');
    const [focusedWCAG, setFocusedWCAG] = createSignal('');
    const [activedWCAG, setActivedWCAG] = createSignal('');
    const [selectedWCAG, setSelectedWCAG] = createSignal('');

    createEffect(()=>{
        raw[props.p] && props.c;

        const baseS = window.getComputedStyle(baseRef);
        setBaseWCAG(wcag(baseS.getPropertyValue('background-color'), baseS.getPropertyValue('color')));

        const lowS = window.getComputedStyle(lowRef);
        setLowWCAG(wcag(lowS.getPropertyValue('background-color'), lowS.getPropertyValue('color')));

        const highS = window.getComputedStyle(highRef);
        setHighWCAG(wcag(highS.getPropertyValue('background-color'), highS.getPropertyValue('color')));

        const disabledS = window.getComputedStyle(disabledRef);
        setDisabledWCAG(wcag(disabledS.getPropertyValue('background-color'), disabledS.getPropertyValue('color')));

        const focusedS = window.getComputedStyle(focusedRef);
        setFocusedWCAG(wcag(focusedS.getPropertyValue('background-color'), focusedS.getPropertyValue('color')));

        const activedS = window.getComputedStyle(activedRef);
        setActivedWCAG(wcag(activedS.getPropertyValue('background-color'), activedS.getPropertyValue('color')));

        const selectedS = window.getComputedStyle(selectedRef);
        setSelectedWCAG(wcag(selectedS.getPropertyValue('background-color'), selectedS.getPropertyValue('color')));
    });

    return <div class={styles.palette}>
        <p class={styles.name}>{props.p}</p>
        <div ref={el => baseRef = el}
            class={joinClass(undefined, styles.color, styles[props.p])}
        >base:{baseWCAG()}</div>
        <div ref={el => lowRef = el}
            class={joinClass(undefined, styles.color, styles[`${props.p}-low`])}
        >low:{lowWCAG() }</div>
        <div ref={el => highRef = el}
            class={joinClass(undefined, styles.color, styles[`${props.p}-high`])}
        >high:{highWCAG()}</div>
        <div class={styles.exts}>
            <div ref={el => disabledRef = el}
                class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-disabled`])}
            >disabled:{disabledWCAG() }</div>
            <div ref={el => focusedRef = el}
                class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-focused`])}
            >focused:{focusedWCAG() }</div>
            <div ref={el => activedRef = el}
                class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-actived`])}
            >actived:{activedWCAG() }</div>
            <div ref={el => selectedRef = el}
                class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-selected`])}
            >selected:{selectedWCAG() }</div>
        </div>
    </div>;
}

function Components(): JSX.Element {
    const items = [
        { id: 1, name: 'name1', address: 'address1' },
        { id: 3, name: 'name3', address: '这是一行很长的数据，这是一行很长的数据，这是一行很长的数据，这是一行很长的数据。' },
        { id: 2, name: 'name2', address: 'address2' },
    ];
    const columns: Array<Column<typeof items[number]>> = [
        { id: 'id' },
        { id: 'name' },
        { id: 'address' },
        {
            id: 'action', renderLabel: 'ACTIONS', isUnexported: true,
            renderContent: () => { return <button>...</button>; },
        }
    ];

    const regUserAccessor = new FormAccessor({
        username: '',
        password: ''
    }, 0 as any);

    return <div class={styles.components}>
        <BasicTable class="w-full! transition-all" items={items} columns={columns} />

        <DatePanel class="transition-all" value={new Date()} />

        <Card class="transition-all" header='注册用户'
            footerClass='flex justify-between'
            footer={<><Button palette='primary'>重置</Button><Button palette='primary'>注册</Button></>}
        >
            <Form accessor={regUserAccessor} layout='vertical'>
                <TextField accessor={regUserAccessor.accessor<string>('username')} label='用户名' placeholder='请输入用户名' />
                <Password accessor={regUserAccessor.accessor<string>('password')} label='密码' placeholder='请输入密码' />
            </Form>
        </Card>

        <Menu class="min-w-50 border border-palette-fg-low rounded-md transition-all" layout='inline' items={[
            { type: 'item', label: 'Item 1', value: '1' },
            { type: 'item', label: 'Item 2', value: '2' },
            { type: 'item', label: 'Item 3', value: '3' },
            { type: 'group', label: 'group', items: [
                { type: 'item', label: 'Item 1', value: '41' },
                { type: 'item', label: 'Item 2', value: '42' },
            ] },
        ]} />
    </div>;
}
