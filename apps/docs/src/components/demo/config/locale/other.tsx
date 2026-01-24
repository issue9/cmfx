// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, useLocale, useOptions } from '@cmfx/components';
import { DisplayStyle } from '@cmfx/core';
import { createSignal, JSX } from 'solid-js';

export default function(): JSX.Element {
    const [accessor] = useOptions();
    const l = useLocale();
    const now = new Date();

    const [locale, setLocale] = createSignal(l.locale.toString());
    const [style, setStyle] = createSignal<DisplayStyle>(accessor.getDisplayStyle());
    const [tz, setTZ] = createSignal(accessor.getTimezone());

    return <div>
        <p>这是继承全局的翻译内容：{ l.datetimeFormat().format(now) }</p>
        <p>这是全局配置项的值：{ l.locale.toString() },{ l.displayStyle },{ l.timezone }</p>

        <LocaleProvider id={locale()} displayStyle={style()} timezone={tz()}>
            <p>这是当前的翻译内容：{ useLocale().datetimeFormat().format(now) }</p>
            <p>当前值：{ useLocale().locale.toString() },{ useLocale().displayStyle },{ useLocale().timezone }</p>

            <div class="flex flex-col">
                <div class="flex">
                    <Button onclick={() => setLocale('en')}>en</Button>
                    <Button onclick={() => setLocale('zh-Hans')}>zh-Hans</Button>
                </div>

                <div class="flex">
                    <Button onclick={() => setStyle('full')}>full</Button>
                    <Button onclick={() => setStyle('short')}>short</Button>
                    <Button onclick={() => setStyle('narrow')}>narrow</Button>
                </div>

                <div class="flex">
                    <Button onclick={() => setTZ('Asia/Shanghai')}>Asia/Shanghai</Button>
                    <Button onclick={() => setTZ('Africa/Abidjan')}>Africa/Abidjan</Button>
                    <Button onclick={() => setTZ('UTC')}>UTC</Button>
                </div>
            </div>
        </LocaleProvider>
    </div>;
}
