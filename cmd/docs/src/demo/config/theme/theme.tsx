// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Scheme, ThemeProvider, use, useTheme } from '@cmfx/components';
import { createSignal } from 'solid-js';

export default function() {
    const [, , opt] = use();
    const [s, setScheme] = createSignal<Scheme | undefined>(typeof opt.scheme === 'string' ? opt.schemes?.get(opt.scheme) : opt.scheme);
    const [m, setMode] = createSignal(opt.mode);
    const g = useTheme();

    return <div>
        <Button>这是继承全局的主题: {g.mode}, {g.scheme?.light?.['primary-bg'] }</Button>

        <ThemeProvider mode={m()} scheme={s()}>
            <Button>这是当前主题 {useTheme().mode}, {useTheme().scheme?.light?.['primary-bg']}</Button>

            <Button onClick={() => setScheme(opt.schemes?.get('default'))}>主题1</Button>
            <Button onClick={() => setScheme(opt.schemes?.get('default2'))}>主题2</Button>

            <Button onClick={() => setMode('light')}>浅色</Button>
            <Button onClick={() => setMode('dark')}>深色</Button>
            <Button onClick={() => setMode('system')}>跟随系统</Button>
        </ThemeProvider>
    </div>;
}
