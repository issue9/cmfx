// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Divider, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'vertical');
	const [Pos, pos] = arraySelector('pos', ['start', 'center', 'end'], 'start');

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Layout />
				<Pos />
			</Portal>

			<div class="w-56 h-56">
				<Divider layout={layout()} palette={palette()} pos={pos()}>
					<IconFace />
					起始位置
				</Divider>
			</div>

			<div class="w-56 h-56">
				<Divider layout={layout()} palette={palette()} pos={pos()}>
					<IconFace />
					english
				</Divider>
			</div>

			<div class="w-56 h-56">
				<Divider layout={layout()} palette={palette()} pos={pos()}>
					<span style={{ 'writing-mode': 'vertical-rl', 'text-orientation': 'upright' }}>
						起始位置<span>111</span>
					</span>
				</Divider>
			</div>

			<div class="w-56 h-56">
				<Divider layout={layout()} palette={palette()} pos={pos()}>
					<span
						style={{
							'writing-mode': 'vertical-rl',
							'text-orientation': 'upright',
							display: 'flex',
							'align-items': 'center',
						}}
					>
						english
						<IconFace />
					</span>
				</Divider>
			</div>

			<div class="w-56 h-56">
				<Divider layout={layout()} palette={palette()} pos={pos()}></Divider>
			</div>
		</div>
	);
}
