// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Scheme, ThemeProvider, useTheme } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';

export default function (): JSX.Element {
	const s1 = { primary: 'yellow', secondary: 'green', tertiary: 'blue', error: 'red', surface: 'white' } as Scheme;
	const s2 = { primary: 'green', secondary: 'blue', tertiary: 'red', error: 'white', surface: 'yellow' } as Scheme;
	const [s, setS] = createSignal<Scheme>(s1);
	return (
		<div class="p-2">
			<ThemeProvider>
				其中 mode 和 scheme 继承自上一层
				<pre>{`${JSON.stringify(useTheme(), null, 4)}`}</pre>
				<ThemeProvider mode="light" scheme={s()}>
					<div class="bg-palette-2-bg p-2 text-palette-2-fg">
						<Button onclick={() => setS(s() === s1 ? s2 : s1)}>change scheme</Button>
						mode 设置为 light, scheme 为自定义
						<pre>{`${JSON.stringify(useTheme(), null, 4)}`}</pre>
						<div class="bg-palette-3-bg p-2 text-palette-3-fg">
							<ThemeProvider>
								其中 mode 和 scheme 继承自上一层
								<pre>{`${JSON.stringify(useTheme(), null, 4)}`}</pre>
							</ThemeProvider>
						</div>
					</div>
				</ThemeProvider>
			</ThemeProvider>
		</div>
	);
}
