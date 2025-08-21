// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, useLocale } from '@cmfx/components';
import { createSignal } from 'solid-js';

export default function() {
    const l = useLocale();
    const [locale, setLocale] = createSignal(l.locale.toString());

    return <div>
        <p>这是继承全局的翻译内容：{ l.t('_c.ok') }</p>
        <p>这是全局配置项的值：{ l.locale.toString() }</p>

        <LocaleProvider id={locale()} displayStyle='narrow'>
            <p>这是当前语言的翻译内容：{useLocale().t('_c.ok')}</p>
            <p>当前值：{ useLocale().locale.toString() }</p>
            <Button onClick={() => setLocale('en')}>en</Button>
            <Button onClick={() => setLocale('zh-Hans')}>zh-Hans</Button>
        </LocaleProvider>
    </div>;
}
