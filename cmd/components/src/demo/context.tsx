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

    const [scheme, setScheme] = createStore(genScheme(20));
    const [contrast, setContrast] = createSignal<Contrast>('nopreference');
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
                <ThemeProvider mode={mode()} contrast={contrast()} scheme={scheme}>
                    <Button palette='primary'>primary</Button>
                    <br />

                    <Button palette='secondary' onclick={()=>setMode(mode() === 'dark' ? 'light' : 'dark')}>light/dark</Button>
                    <br />

                    <label> 颜色
                        <select value={scheme.primary} onChange={(e) => {
                            const value = e.target.value;
                            setScheme(genScheme(parseInt(value)));
                        }}>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </label>
                    <br />

                    <label> 对比度
                        <select value={contrast()} onChange={(e) => {
                            const value = e.target.value as Contrast;
                            setContrast(value);
                        }}>
                            <option value='more'>more</option>
                            <option value='less'>less</option>
                            <option value='nopreference'>nopreference</option>
                        </select>
                    </label>
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
