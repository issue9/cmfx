// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, type MountProps, Notify } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, paletteSelector } from '@docs/components/base';

export function typeSelector() {
	return arraySelector('types', Alert.types, 'success');
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Type, typ] = typeSelector();

	return (
		<div class="flex w-full flex-col gap-2">
			<Portal mount={props.mount}>
				<Palette />
				<Type />
			</Portal>

			<Alert palette={palette()} type={typ()} title="Alert Title" />

			<Alert
				palette={palette()}
				type={typ()}
				title="由 onclose 阻止"
				icon={<IconFace />}
				onCancel={async () => {
					await Notify.notify('取消按钮阻止了关闭操作!');
					return true;
				}}
				onAccept={async () => {
					await Notify.success('确认按钮阻止了关闭操作！');
					return true;
				}}
			/>

			<Alert onCancel={true} palette={palette()} type={typ()} title="Alert Title" icon={false} />
		</div>
	);
}
