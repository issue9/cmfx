// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, useLocale, useOptions } from '@cmfx/components';
import type { DisplayStyle } from '@cmfx/core';
import { createSignal, type JSX } from 'solid-js';

export default function (): JSX.Element {
	const [accessor] = useOptions();
	const l = useLocale();
	const now = new Date();

	const [locale, setLocale] = createSignal(l.locale.toString());
	const [style, setStyle] = createSignal<DisplayStyle>(accessor.getDisplayStyle());
	const [tz, setTZ] = createSignal(accessor.getTimezone());

	return (
		<div>
			<p>这是继承全局的翻译内容：{l.datetimeFormat().format(now)}</p>
			<p>
				这是全局配置项的值：{l.locale.toString()},{l.displayStyle},{l.timezone}
			</p>

			<LocaleProvider id={locale()} displayStyle={style()} timezone={tz()}>
				<p>这是当前的翻译内容：{useLocale().datetimeFormat().format(now)}</p>
				<p>
					当前值：{useLocale().locale.toString()},{useLocale().displayStyle},{useLocale().timezone}
				</p>

				<div class="flex flex-col">
					<div class="flex">
						<Button.Root onclick={() => setLocale('en')}>en</Button.Root>
						<Button.Root onclick={() => setLocale('zh-Hans')}>zh-Hans</Button.Root>
					</div>

					<div class="flex">
						<Button.Root onclick={() => setStyle('full')}>full</Button.Root>
						<Button.Root onclick={() => setStyle('short')}>short</Button.Root>
						<Button.Root onclick={() => setStyle('narrow')}>narrow</Button.Root>
					</div>

					<div class="flex">
						<Button.Root onclick={() => setTZ('Asia/Shanghai')}>Asia/Shanghai</Button.Root>
						<Button.Root onclick={() => setTZ('Africa/Abidjan')}>Africa/Abidjan</Button.Root>
						<Button.Root onclick={() => setTZ('UTC')}>UTC</Button.Root>
					</div>
				</div>
			</LocaleProvider>
		</div>
	);
}
