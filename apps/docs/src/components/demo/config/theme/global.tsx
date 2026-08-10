// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, ThemeProvider, useTheme } from '@cmfx/cdk';
import { Button, useOptions } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (_: MountProps): JSX.Element {
	const [act, opt] = useOptions();
	const t = useTheme();

	return (
		<div>
			<Button>
				这是继承全局的主题: {t.mode}, {t.scheme?.primary}
			</Button>

			<ThemeProvider mode="light" scheme={opt.schemes?.get('green')}>
				<Button>这是当前固定的主题-green</Button>

				<Button onclick={() => act.setScheme('purple')}>主题-purple</Button>
				<Button onclick={() => act.setScheme('green')}>主题-green</Button>

				<Button onclick={() => act.setMode('light')}>浅色</Button>
				<Button onclick={() => act.setMode('dark')}>深色</Button>
				<Button onclick={() => act.setMode('system')}>跟随系统</Button>
			</ThemeProvider>
		</div>
	);
}
