// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ThemeProvider, useTheme } from '@cmfx/components';
import { JSX, createSignal } from 'solid-js';

export default function(): JSX.Element {
    const s1 = { primary: 'yellow', secondary: 'green', tertiary: 'blue', error: 'red', surface: 'white' };
    const s2 = { primary: 'green', secondary: 'blue', tertiary: 'red', error: 'white', surface: 'yellow' };
    const [s, setS] = createSignal(s1);
    return <div class="p-2">
        <ThemeProvider >
            其中 mode 和 scheme 继承自上一层
            <p>{`mode: ${useTheme().mode}, scheme.primary: ${useTheme().scheme?.primary}，scheme.secondary: ${useTheme().scheme?.secondary}`}</p>
            <ThemeProvider mode='light' scheme={s()}>
                <div class="p-2 bg-palette-2-bg text-palette-2-fg">
                    <Button onclick={() => setS(s() == s1 ? s2 : s1)}>change scheme</Button>
                    mode 设置为 light, scheme 为自定义
                    <p>{`mode: ${useTheme().mode}, scheme.primary: ${useTheme().scheme?.primary}，scheme.secondary: ${useTheme().scheme?.secondary}`}</p>

                    <div class="p-2 bg-palette-3-bg text-palette-3-fg">
                        <ThemeProvider>
                            其中 mode 和 scheme 继承自上一层
                            <p>{`mode: ${useTheme().mode}, scheme.primary: ${useTheme().scheme?.primary}，scheme.secondary: ${useTheme().scheme?.secondary}`}</p>
                        </ThemeProvider>
                    </div>
                </div>
            </ThemeProvider>
        </ThemeProvider>
    </div>;
}
