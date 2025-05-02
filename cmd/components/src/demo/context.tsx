// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, ThemeProvider, use, useLocale } from '@cmfx/components';
import { Contrast, Locale, Mode, Theme } from '@cmfx/core';
import { createSignal, For } from 'solid-js';

import { Demo, Stage } from './base';

export default function() {
    const [, act, opt] = use();
    const [mode, setMode] = createSignal<Mode>('system');

    return <Demo>
        <Stage title="locale provider">
            <Button>{useLocale().t('_i.ok')}</Button>
            <LocaleProvider id='zh-hans' unitStyle='narrow'>
                <Button>{useLocale().t('_i.ok')}</Button>
                <LocaleProvider id='en' unitStyle='narrow'>
                    <Button>{useLocale().t('_i.ok')}</Button>
                </LocaleProvider>
            </LocaleProvider>
        </Stage>

        <Stage title="theme provider">
            <ThemeProvider mode='dark' contrast='less' scheme={Theme.genScheme(70)}>
                <Button>button</Button>
                <ThemeProvider mode={mode()} contrast='less' scheme={Theme.genScheme(50)}>
                    <Button onclick={()=>setMode(mode() === 'dark' ? 'light' : 'dark')}>toggle</Button>
                </ThemeProvider>
            </ThemeProvider>
        </Stage>

        <Stage title="全局配置">
            <Button>{ useLocale().t('_i.ok') }</Button>
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
                act.switchScheme(parseInt(value));
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
