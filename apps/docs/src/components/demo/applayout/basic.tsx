// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { breakpoints, type MountProps } from '@cmfx/cdk';
import { Appbar, AppLayout, Button, ToggleButton, useOptions } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconPerson from '~icons/material-symbols/person';

import { arraySelector, boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [, opt] = useOptions();
	const [Palette, palette] = paletteSelector('primary');
	const [ToolbarPalette, toolbarPalette] = paletteSelector('surface');
	const [AisdePalette, asidePalette] = paletteSelector('secondary');
	const [Float, float] = boolSelector('float');
	const [Layout, layout] = layoutSelector('layout');
	const [FloatingBreakpoint, floatingBreakpoint] = arraySelector('floatingBreakpoint', breakpoints);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<ToolbarPalette />
				<AisdePalette />
				<Float />
				<Layout />
				<FloatingBreakpoint />
			</Portal>

			<AppLayout
				class="h-100 w-full border border-red-500"
				palette={palette()}
				floatingMinWidth={floatingBreakpoint()}
				toolbarPalette={toolbarPalette()}
				asidePalette={asidePalette()}
				layout={layout()}
				brand={<Appbar.Brand logo={opt.logo} title={opt.title} />}
				aside={
					<div class="min-h-20 min-w-5 border border-red-500">
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
					</div>
				}
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
