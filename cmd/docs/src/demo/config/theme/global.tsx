// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ThemeProvider, useComponents, useTheme } from '@cmfx/components';

export default function() {
    const [, act, opt] = useComponents();
    const t = useTheme();

    return <div>
        <Button>这是继承全局的主题: {t.mode}, {t.scheme?.light?.['primary-bg'] }</Button>

        <ThemeProvider mode='light' scheme={opt.schemes?.get('green')}>
            <Button>这是当前固定的主题-green</Button>

            <Button onclick={() => act.switchScheme('purple')}>主题-purple</Button>
            <Button onclick={() => act.switchScheme('green')}>主题-green</Button>

            <Button onclick={() => act.switchMode('light')}>浅色</Button>
            <Button onclick={() => act.switchMode('dark')}>深色</Button>
            <Button onclick={() => act.switchMode('system')}>跟随系统</Button>
        </ThemeProvider>
    </div>;
}
