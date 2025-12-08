// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, useComponents, useLocale } from '@cmfx/components';

export default function() {
    const [act] = useComponents();
    const l = useLocale();

    return <div>
        <LocaleProvider id='zh-Hans' displayStyle='narrow'>
            <p>无论全局如何变化，当前局部始终为 zh-Hans：{useLocale().t('_c.ok')}</p>
            <p>这是全局配置项的值：{ l.locale.toString() }</p>
            <Button onclick={() => act.switchLocale('en')}>en</Button>
            <Button onclick={() => act.switchLocale('zh-Hans')}>zh-Hans</Button>
        </LocaleProvider>
    </div>;
}
