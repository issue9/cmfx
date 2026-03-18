// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ThemeProvider, useOptions, useTheme } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	const [act, opt] = useOptions();
	const t = useTheme();

	return (
		<div>
			<Button.Root>
				这是继承全局的主题: {t.mode}, {t.scheme?.primary}
			</Button.Root>

			<ThemeProvider mode="light" scheme={opt.schemes?.get('green')}>
				<Button.Root>这是当前固定的主题-green</Button.Root>

				<Button.Root onclick={() => act.setScheme('purple')}>主题-purple</Button.Root>
				<Button.Root onclick={() => act.setScheme('green')}>主题-green</Button.Root>

				<Button.Root onclick={() => act.setMode('light')}>浅色</Button.Root>
				<Button.Root onclick={() => act.setMode('dark')}>深色</Button.Root>
				<Button.Root onclick={() => act.setMode('system')}>跟随系统</Button.Root>
			</ThemeProvider>
		</div>
	);
}
