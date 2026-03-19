// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/components';
import {
	Alert,
	Button,
	Choice,
	fieldAccessor,
	Notify,
	Numeric,
	TextArea,
	TextField,
	useLocale,
	useOptions,
} from '@cmfx/components';
import { createEffect, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const l = useLocale();
	const [System, system] = boolSelector('system');
	const [accessor] = useOptions();

	const typ = fieldAccessor<Alert.Type>('type', 'success');
	const timeout = fieldAccessor<number>('timeout', 5000);
	const title = fieldAccessor<string>('title', 'title');
	const body = fieldAccessor<string>('body', 'body');

	const click = async (): Promise<void> => {
		await Notify.notify(title.getValue(), body.getValue(), typ.getValue(), l.locale.toString(), timeout.getValue());
	};

	createEffect(() => {
		accessor.setSystemNotify(system());
	});

	return (
		<div class="flex w-40 flex-col gap-2">
			<Portal mount={props.mount}>
				<System />
			</Portal>

			<Choice.Root
				label="type"
				accessor={typ}
				options={Alert.types.map(v => {
					return { type: 'item', value: v, label: v };
				})}
			/>
			<Numeric.Root step={500} label="timeout" accessor={timeout} />
			<TextField.Root label="title" accessor={title} />
			<TextArea.Root label="body" accessor={body} />
			<Button.Root palette="primary" onclick={click}>
				notify
			</Button.Root>
		</div>
	);
}
