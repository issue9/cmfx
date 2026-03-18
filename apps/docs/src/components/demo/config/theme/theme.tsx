// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Divider, IconSet, type Scheme, ThemeProvider, useOptions, useTheme } from '@cmfx/components';
import { createSignal } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

export default function () {
	const [_, origin] = useOptions();
	const [s, setScheme] = createSignal<Scheme | undefined>(origin.scheme);
	const [m, setMode] = createSignal(origin.mode);
	const g = useTheme();

	const [m2, setMode2] = createSignal(origin.mode);

	let ref: IconSet.RootRef;

	return (
		<div>
			<Button.Root>
				这是继承上一层的主题: {g.mode}, {g.scheme?.primary}
			</Button.Root>
			<Divider.Root />

			<ThemeProvider mode={m()} scheme={s()}>
				<Button.Root>
					这是当前主题 {useTheme().mode}, {useTheme().scheme?.primary}
				</Button.Root>

				<Button.Root onclick={() => setScheme(origin.schemes?.get('purple'))}>主题-purple</Button.Root>
				<Button.Root onclick={() => setScheme(origin.schemes?.get('green'))}>主题-green</Button.Root>

				<Button.Root onclick={() => setMode('light')}>浅色</Button.Root>
				<Button.Root onclick={() => setMode('dark')}>深色</Button.Root>
				<Button.Root onclick={() => setMode('system')}>跟随系统</Button.Root>
				<Button.Root onclick={() => ref.next()} class="w-16">
					<IconSet.Root
						ref={el => (ref = el)}
						icons={{
							face: <IconFace />,
							close: <IconClose />,
							person: <IconPerson />,
						}}
					/>
				</Button.Root>

				<ThemeProvider mode={m2()}>
					<Divider.Root />
					<Button.Root>这是另一个嵌套的主题 {useTheme().mode}</Button.Root>
					<Button.Root onclick={() => setMode2('light')}>浅色</Button.Root>
					<Button.Root onclick={() => setMode2('dark')}>深色</Button.Root>
					<Button.Root onclick={() => setMode2('system')}>跟随系统</Button.Root>
				</ThemeProvider>
			</ThemeProvider>
		</div>
	);
}
