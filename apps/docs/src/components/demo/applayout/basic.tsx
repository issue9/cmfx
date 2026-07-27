// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, AppLayout, Button, type MountProps, ToggleButton, useOptions } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconPerson from '~icons/material-symbols/person';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [, opt] = useOptions();
	const [Palette, palette] = paletteSelector('primary');
	const [MainPalette, mainPalette] = paletteSelector('surface');
	const [Float, float] = boolSelector('float');
	const [Layout, layout] = layoutSelector('layout');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<MainPalette />
				<Float />
				<Layout />
			</Portal>

			<AppLayout
				class="h-100 w-full"
				palette={palette()}
				mainPalette={mainPalette()}
				layout={layout()}
				brand={<Appbar.Brand logo={opt.logo} title={opt.title} />}
				aside={<div class="min-h-20 min-w-5 border border-red-500">
					<p>aaa</p>
					<p>aaa</p>
					<p>aaa</p>
					<p>aaa</p>
					<p>aaa</p>
					<p>aaa</p>
					<p>bbb</p>
					<p>bbb</p>
					<p>bbb</p>
					<p>bbb</p>
					<p>ccc</p>
					<p>ccc</p>
					<p>ccc</p>
					<p>ccc</p>
					<p>ddd</p>
					<p>ddd</p>
					<p>ddd</p>
					<p>ddd</p>
				</div>}
				extra={
					<Button square kind="flat" class="w-4">
						<IconPerson />
					</Button>
				}
				toolbar={<p class="min-w-20 border border-red-500">toolbar</p>}
				actions={
					<>
						<ToggleButton.FullScreen />{' '}
						<Button square>
							<IconPerson />
						</Button>{' '}
					</>
				}
				float={float()}
			>
				<div class="bg-palette-bg text-palette-fg">main</div>
			</AppLayout>
		</>
	);
}
