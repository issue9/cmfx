// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Contrast, genScheme, LocaleProvider, Mode, ThemeProvider, use, useLocale } from '@cmfx/components';
import { Locale } from '@cmfx/core';
import { createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Demo, Stage } from './base';

export default function() {
    const [, act, opt] = use();
    const [mode, setMode] = createSignal<Mode>('system');
    const l = useLocale();

    const [theme, setTheme] = createStore(genScheme(20));
    const [contrast, setContrast] = createSignal<Contrast>('nopreference');

    return <Demo>
        <Stage title="locale provider">
            <Button>{l.t('_c.ok')}</Button>
            <LocaleProvider id='zh-hans' unitStyle='narrow'>
                <Button>{useLocale().t('_c.ok')}</Button>
                <LocaleProvider id='en' unitStyle='narrow'>
                    <Button>{useLocale().t('_c.ok')}</Button>
                </LocaleProvider>
            </LocaleProvider>
        </Stage>

        <Stage title="theme provider">
            <ThemeProvider mode='dark' contrast='less' scheme={genScheme(70)}>
                <Button>button</Button>
                <ThemeProvider mode={mode()} contrast={contrast()} scheme={theme}>
                    <Button palette='secondary' onclick={()=>setMode(mode() === 'dark' ? 'light' : 'dark')}>toggle</Button>
                    <Button palette='primary'>primary</Button>
                    <select onChange={(e) => {
                        const value = e.target.value;
                        setTheme(genScheme(parseInt(value)));
                    }}>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <select value={contrast()} onChange={(e) => {
                        const value = e.target.value as Contrast;
                        setContrast(value);
                    }}>
                        <option value='more'>more</option>
                        <option value='less'>less</option>
                        <option value='nopreference'>nopreference</option>
                    </select>
                </ThemeProvider>
            </ThemeProvider>
        </Stage>

        <Stage title="全局配置">
            <Button>{ l.t('_c.ok') }</Button>
            <select onchange={(e) => {
                const value = e.target.value;
                act.switchLocale(value);
            }}>
                <For each={Locale.languages()}>
                    {(item)=>(
                        <option selected={item === opt.locale} value={item}>{item}</option>
                    )}
                </For>
            </select>
            
            <select onChange={(e) => {
                const value = e.target.value;
                act.switchScheme(genScheme(parseInt(value)));
            }}>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>

            <select value={opt.contrast} onChange={(e) => {
                const value = e.target.value as Contrast;
                act.switchContrast(value);
            }}>
                <option value='more'>more</option>
                <option value='less'>less</option>
                <option value='nopreference'>nopreference</option>
            </select>

            <select value={opt.mode} onChange={(e) => {
                const value = e.target.value as Mode;
                act.switchMode(value);
            }}>
                <option value='system'>system</option>
                <option value='dark'>dark</option>
                <option value='light'>light</option>
            </select>

            <Button onClick={()=>act.switchConfig(1)}>切换到配置1</Button>
            <Button onClick={()=>act.switchConfig(2)}>切换到配置2</Button>
        </Stage>

    </Demo>;
}
