// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, IconSet, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

import { arraySelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	let aref: IconSet.RootRef;
	const [Rotation, rotation] = arraySelector<IconSet.Rotation>('rotation', IconSet.rotations, 'none');
	const [Palette, palette] = paletteSelector();

	return (
		<div class="flex flex-col gap-2">
			<Portal mount={props.mount}>
				<Rotation />
				<Palette />
			</Portal>

			<Button.Root palette={palette()}>
				<IconSet.Root
					class="aspect-square w-8!"
					ref={el => (aref = el)}
					icons={{
						face: <IconFace />,
						close: <IconClose />,
						person: <IconPerson />,
					}}
					rotation={rotation()}
				/>
			</Button.Root>

			<Button.Root palette={palette()} onclick={() => aref?.to('face')}>
				face
			</Button.Root>
			<Button.Root palette={palette()} onclick={() => aref?.to('close')}>
				close
			</Button.Root>
			<Button.Root palette={palette()} onclick={() => aref?.to('not-exists')}>
				not-exists
			</Button.Root>

			<Button.Root palette={palette()} onclick={() => aref?.next()}>
				next
			</Button.Root>
			<Button.Root palette={palette()} onclick={() => aref?.prev()}>
				prev
			</Button.Root>
		</div>
	);
}
