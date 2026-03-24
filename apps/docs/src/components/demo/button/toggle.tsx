// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, ToggleButton } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, buttonKindSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Kind, kind] = buttonKindSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	let screenElement: HTMLDivElement;

	let toggleFlag2 = false;

	return (
		<div>
			<Portal mount={props.mount}>
				<Kind />
				<Disabled />
				<Rounded />
			</Portal>

			<div class="flex flex-wrap items-center gap-2">
				<ToggleButton.Root
					disabled={disabled()}
					rounded={rounded()}
					kind={kind()}
					palette="tertiary"
					on={<IconClose />}
					off={<IconFace />}
					onToggle={async () => {
						toggleFlag2 = !toggleFlag2;
						return toggleFlag2;
					}}
					hotkey={new Hotkey('b', 'shift')}
				/>

				<ToggleButton.FullScreen
					disabled={disabled()}
					rounded={rounded()}
					kind={kind()}
					palette="primary"
					hotkey={new Hotkey('a', 'alt')}
				/>
				<ToggleButton.FullScreen
					disabled={disabled()}
					rounded={rounded()}
					kind={kind()}
					palette="secondary"
					hotkey={new Hotkey('b', 'alt')}
				/>

				<br />

				<div class="bg-palette-bg" ref={el => (screenElement = el)}>
					<ToggleButton.FitScreen
						disabled={disabled()}
						rounded={rounded()}
						kind={kind()}
						container={screenElement!}
						palette="primary"
						hotkey={new Hotkey('a', 'control')}
					/>
					screen
				</div>
			</div>
		</div>
	);
}
