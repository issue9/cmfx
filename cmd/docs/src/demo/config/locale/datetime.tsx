// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, useComponents, useLocale } from '@cmfx/components';
import { DisplayStyle } from '@cmfx/core';
import { createSignal } from 'solid-js';

export default function() {
    const [, , opt] = useComponents();
    const l = useLocale();
    const now = new Date();

    const [locale, setLocale] = createSignal(l.locale.toString());
    const [style, setStyle] = createSignal<DisplayStyle>(opt.displayStyle);
    const [tz, setTZ] = createSignal(opt.timezone);

    return <div>
        <p>这是继承全局的翻译内容：{ l.datetimeFormat().format(now) }</p>
        <p>这是全局配置项的值：{ l.locale.toString() },{ l.displayStyle },{ l.timezone }</p>

        <LocaleProvider id={locale()} displayStyle={style()} timezone={tz()}>
            <p>这是当前的翻译内容：{ useLocale().datetimeFormat().format(now) }</p>
            <p>当前值：{ useLocale().locale.toString() },{ useLocale().displayStyle },{ useLocale().timezone }</p>

            <div class="flex flex-col">
                <div class="flex">
                    <Button onClick={() => setLocale('en')}>en</Button>
                    <Button onClick={() => setLocale('zh-Hans')}>zh-Hans</Button>
                </div>

                <div class="flex">
                    <Button onClick={() => setStyle('full')}>full</Button>
                    <Button onClick={() => setStyle('short')}>short</Button>
                    <Button onClick={() => setStyle('narrow')}>narrow</Button>
                </div>

                <div class="flex">
                    <Button onClick={() => setTZ('Asia/Shanghai')}>Asia/Shanghai</Button>
                    <Button onClick={() => setTZ('Africa/Abidjan')}>Africa/Abidjan</Button>
                    <Button onClick={() => setTZ('UTC')}>UTC</Button>
                </div>
            </div>
        </LocaleProvider>
    </div>;
}
