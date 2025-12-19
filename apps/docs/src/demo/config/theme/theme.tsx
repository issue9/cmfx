// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { IconSet, IconSetRef, Button, Divider, Scheme, ThemeProvider, useOptions, useTheme } from '@cmfx/components';
import { createSignal } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

export default function() {
    const [, opt] = useOptions();
    const [s, setScheme] = createSignal<Scheme | undefined>(typeof opt.scheme === 'string' ? opt.schemes?.get(opt.scheme) : opt.scheme);
    const [m, setMode] = createSignal(opt.mode);
    const g = useTheme();

    const [m2, setMode2] = createSignal(opt.mode);

    let ref: IconSetRef;

    return <div>
        <Button>这是继承上一层的主题: {g.mode}, {g.scheme?.light?.['primary-bg']}</Button>
        <Divider />

        <ThemeProvider mode={m()} scheme={s()}>
            <Button>这是当前主题 {useTheme().mode}, {useTheme().scheme?.light?.['primary-bg']}</Button>

            <Button onclick={() => setScheme(opt.schemes?.get('purple'))}>主题-purple</Button>
            <Button onclick={() => setScheme(opt.schemes?.get('green'))}>主题-green</Button>

            <Button onclick={() => setMode('light')}>浅色</Button>
            <Button onclick={() => setMode('dark')}>深色</Button>
            <Button onclick={() => setMode('system')}>跟随系统</Button>
            <Button onclick={() => ref.next()} class="w-16">
                <IconSet ref={el => ref = el} icons={{
                    face: <IconFace />,
                    close: <IconClose />,
                    person: <IconPerson />,
                }} />
            </Button>

            <ThemeProvider mode={m2()}>
                <Divider />
                <Button>这是另一个嵌套的主题 {useTheme().mode}</Button>
                <Button onclick={() => setMode2('light')}>浅色</Button>
                <Button onclick={() => setMode2('dark')}>深色</Button>
                <Button onclick={() => setMode2('system')}>跟随系统</Button>
            </ThemeProvider>
        </ThemeProvider>
    </div>;
}
