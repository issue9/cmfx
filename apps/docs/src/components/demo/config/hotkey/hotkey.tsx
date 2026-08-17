// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey, HotkeyProvider, type MountProps } from '@cmfx/cdk';
import { Button, Notify } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (_: MountProps): JSX.Element {
	let child: HTMLDivElement | undefined;

	return (
		<div>
			<p>这是全局的 `HotkeyProvider`，注册在 `document.body`。</p>
			<input class="border border-palette-2-bg" />
			<Button hotkey={new Hotkey('s', 'control', 'alt')} onclick={() => Notify.info('ctrl+alt+s 全局')}>
				ctrl+alt+s
			</Button>
			<Button hotkey={new Hotkey('a', 'control', 'alt')} onclick={() => Notify.info('ctrl+alt+a')}>
				ctrl+alt+a
			</Button>

			<div class="border border-palette-border bg-palette-bg/50 p-2" ref={el => (child = el)}>
				<p>这是另一个 `HotkeyProvider`，注册在当前的 div 上。</p>
				<input class="border border-palette-2-bg" />
				<HotkeyProvider root={child}>
					<Button hotkey={new Hotkey('s', 'alt', 'control')} onclick={() => Notify.info('ctrl+alt+s 子组件')}>
						ctrl+alt+s
					</Button>

					<Button hotkey={new Hotkey('b', 'alt', 'control')} onclick={() => Notify.info('ctrl+alt+b')}>
						ctrl+alt+b
					</Button>
				</HotkeyProvider>
			</div>
		</div>
	);
}
