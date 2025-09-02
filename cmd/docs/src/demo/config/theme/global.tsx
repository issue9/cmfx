// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ThemeProvider, useComponents, useTheme } from '@cmfx/components';

export default function() {
    const [, act, opt] = useComponents();
    const t = useTheme();

    return <div>
        <Button>这是继承全局的主题: {t.mode}, {t.scheme?.light?.['primary-bg'] }</Button>

        <ThemeProvider mode='light' scheme={opt.schemes?.get('default')}>
            <Button>这是当前固定的主题1</Button>

            <Button onClick={() => act.switchScheme('default')}>主题1</Button>
            <Button onClick={() => act.switchScheme('default2')}>主题2</Button>

            <Button onClick={() => act.switchMode('light')}>浅色</Button>
            <Button onClick={() => act.switchMode('dark')}>深色</Button>
            <Button onClick={() => act.switchMode('system')}>跟随系统</Button>
        </ThemeProvider>
    </div>;
}
