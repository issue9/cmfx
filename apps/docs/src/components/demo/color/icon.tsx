// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Color, Form, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconPerson from '~icons/material-symbols/person';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	const [F, Field] = Form.create({ initValue: { a: 'oklch(1% 0.3 100)' } });

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
				<Rounded />
				<Layout />
			</Portal>

			<F>
				<Field name="a" label="picker label" layout={layout()}>
					<Color.Root
						popover="hover"
						readonly={readonly()}
						disabled={disabled()}
						palette={palette()}
						rounded={rounded()}
						spaces={[new Color.TailwindVarsSpace(), new Color.OKLCHSpace(), new Color.HSLSpace(), new Color.RGBSpace()]}
					>
						<IconPerson />
					</Color.Root>
				</Field>
			</F>
		</>
	);
}
