// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Divider, Scheme, ThemeProvider, useComponents, useTheme } from '@cmfx/components';
import { createSignal } from 'solid-js';

export default function() {
    const [, , opt] = useComponents();
    const [s, setScheme] = createSignal<Scheme | undefined>(typeof opt.scheme === 'string' ? opt.schemes?.get(opt.scheme) : opt.scheme);
    const [m, setMode] = createSignal(opt.mode);
    const g = useTheme();

    const [m2, setMode2] = createSignal(opt.mode);

    return <div>
        <Button>这是继承全局的主题: {g.mode}, {g.scheme?.light?.['primary-bg'] }</Button>
        <Divider />

        <ThemeProvider mode={m()} scheme={s()}>
            <Button>这是当前主题 {useTheme().mode}, {useTheme().scheme?.light?.['primary-bg']}</Button>

            <Button onClick={() => setScheme(opt.schemes?.get('default'))}>主题1</Button>
            <Button onClick={() => setScheme(opt.schemes?.get('default2'))}>主题2</Button>

            <Button onClick={() => setMode('light')}>浅色</Button>
            <Button onClick={() => setMode('dark')}>深色</Button>
            <Button onClick={() => setMode('system')}>跟随系统</Button>

            <ThemeProvider mode={m2()}>
                <Divider />
                <Button>这是另一个嵌套的主题 {useTheme().mode}</Button>
                <Button onClick={() => setMode2('light')}>浅色</Button>
                <Button onClick={() => setMode2('dark')}>深色</Button>
                <Button onClick={() => setMode2('system')}>跟随系统</Button>
            </ThemeProvider>
        </ThemeProvider>
    </div>;
}
