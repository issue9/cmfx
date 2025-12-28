// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, useLocale } from '@cmfx/components';
import { JSX, createSignal } from 'solid-js';

export default function (): JSX.Element {
    const [style, setStyle] = createSignal('full');

    return <div class="p-2">
        <LocaleProvider id="zh" displayStyle={style()}>
            其中 timezone 继承自合局的默认值，
            <Button onclick={() => setStyle(style() === 'full' ? 'short' : 'full')}>change style</Button>
            <p>当前值：{useLocale().locale.toString()},{useLocale().displayStyle},{useLocale().timezone}</p>
            <div class="p-2 bg-palette-2-bg text-palette-2-fg">
                <LocaleProvider id="en" timezone='UTC'>
                    其中 timezone 设置为 utc, displayStyle 继承自上一层的值
                    <p>当前值：{useLocale().locale.toString()},{useLocale().displayStyle},{useLocale().timezone}</p>

                    <div class="p-2 bg-palette-3-bg text-palette-3-fg">
                        <LocaleProvider id="zh">
                            其中 timezone 继承自上一层的值, displayStyle 继承自上一层的值
                            <p>当前值：{useLocale().locale.toString()},{useLocale().displayStyle},{useLocale().timezone}</p>
                        </LocaleProvider>
                    </div>
                </LocaleProvider>
            </div>
        </LocaleProvider>
    </div>;
}
