// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Colors, LocaleProvider, Mode, Scheme, ThemeProvider, use, useLocale } from '@cmfx/components';
import { Locale, rand } from '@cmfx/core';
import { createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Demo, Stage } from './base';

export default function() {
    const [, act, opt] = use();
    const [mode, setMode] = createSignal<Mode>('system');
    const l = useLocale();

    const [scheme, setScheme] = createStore(genScheme());
    const [locale, setLocale] = createSignal<string>('zh-Hans');

    return <Demo>
        <Stage title="locale provider">
            <span>全局</span>
            <Button>{l.t('_c.ok')}</Button>

            <fieldset class="p-2 border border-palette-fg">
                <legend>zh-hans</legend>
                <LocaleProvider id='zh-hans' unitStyle='narrow'>
                    <Button>{useLocale().t('_c.ok')}</Button>
                    <fieldset class="p-2 border border-palette-fg">
                        <legend>动态</legend>
                        <select value={locale()} onchange={e=>setLocale(e.target.value)}>
                            <option value='zh-Hans'>zh-hans</option>
                            <option value='en'>en</option>
                        </select>
                        <LocaleProvider id={locale()} unitStyle='narrow'>
                            <Button>{useLocale().t('_c.ok')}</Button>
                        </LocaleProvider>
                    </fieldset>
                </LocaleProvider>
            </fieldset>
        </Stage>

        <Stage title="theme provider">
            <span>全局</span>
            <Button>button</Button>
            <fieldset class="p-2 border border-palette-fg">
                <ThemeProvider mode={mode()} scheme={scheme}>
                    <Button palette='primary'>primary</Button>
                    <br />

                    <Button palette='secondary' onclick={()=>setMode(mode() === 'dark' ? 'light' : 'dark')}>light/dark</Button>
                    <br />

                    <Button onClick={()=>{
                        setScheme(genScheme());
                    }}>switch scheme</Button>
                </ThemeProvider>
            </fieldset>
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
                act.switchScheme(e.target.value);
            }}>
                <For each={Array.from(opt.schemes!.entries())}>
                    {(item)=>(
                        <option value={item[0]}>{item[0]}</option>
                    )}
                </For>
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

function genScheme(): Scheme {
    return {
        dark: {
            'primary-bg': '#'+rand(111, 999, 0).toString(),
            'secondary-bg': '#'+rand(111, 999, 0).toString(),
            'tertiary-bg': '#'+rand(111, 999, 0).toString(),
            'surface-bg': '#'+rand(111, 999, 0).toString(),
        } as Colors,
        light: {
            'primary-bg': '#'+rand(111, 999, 0).toString(),
            'secondary-bg': '#'+rand(111, 999, 0).toString(),
            'tertiary-bg': '#'+rand(111, 999, 0).toString(),
            'surface-bg': '#'+rand(111, 999, 0).toString(),
        } as Colors,
    };
}
