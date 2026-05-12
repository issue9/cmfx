// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Form, InputText, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [txt, setTxt] = createSignal('text');

	const [Palette, palette] = paletteSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);
	const [Count, count] = boolSelector('_d.demo.charCount', false);

	const prefix = () => <div class="flex items-center bg-red-500">prefix</div>;
	const suffix = () => <div class="flex items-center bg-red-500">suffix</div>;

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Readonly />
				<Rounded />
				<Disabled />
				<Layout />
				<Count />
			</Portal>

			<div class="flex w-80 flex-col gap-2">
				<InputText.Root
					count={count() ? (v, m) => `${v}-${m}` : undefined}
					placeholder="placeholder"
					palette={palette()}
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
					value={txt()}
					onChange={setTxt}
				/>

				<Form.Field label="label+no help" layout={layout()}>
					<InputText.Root
						suffix={
							<Button.Root square kind="flat">
								<IconFace />
							</Button.Root>
						}
						maxLength={10}
						count={count()}
						placeholder="placeholder"
						palette={palette()}
						disabled={disabled()}
						rounded={rounded()}
						readonly={readonly()}
						value={txt()}
						onChange={setTxt}
					/>
				</Form.Field>

				<Form.Field label="prefix" layout={layout()} help="这是显示帮助内容">
					<InputText.Root
						count={count()}
						placeholder="placeholder"
						prefix={
							<Button.Root square kind="flat">
								<IconFace />
							</Button.Root>
						}
						palette={palette()}
						disabled={disabled()}
						rounded={rounded()}
						readonly={readonly()}
						value={txt()}
						onChange={setTxt}
					/>
				</Form.Field>

				<Form.Field label="prefix+suffix" layout={layout()} help="这是显示帮助内容">
					<InputText.Root
						count={count()}
						placeholder="placeholder"
						prefix={prefix()}
						suffix={suffix()}
						palette={palette()}
						disabled={disabled()}
						rounded={rounded()}
						readonly={readonly()}
						value={txt()}
						onChange={setTxt}
					/>
				</Form.Field>

				<Form.Field label="onsearch" layout={layout()} help="这是显示帮助内容">
					<InputText.Root
						maxLength={10}
						count={count()}
						placeholder="placeholder"
						class="w-100"
						prefix={prefix()}
						suffix={suffix()}
						palette={palette()}
						disabled={disabled()}
						rounded={rounded()}
						readonly={readonly()}
						value={txt()}
						onChange={setTxt}
						onSearch={v => {
							if (!v) return [];
							return ['abc@gmail.com', 'def@qq.com', 'ghi@126.com'].filter(item => item.includes(v));
						}}
					/>
				</Form.Field>
			</div>
		</>
	);
}
