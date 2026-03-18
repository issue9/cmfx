// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, useLocale, useOptions } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	const [accessor] = useOptions();
	const l = useLocale();

	return (
		<div>
			<LocaleProvider id="zh-Hans" displayStyle="narrow">
				<p>无论全局如何变化，当前局部始终为 zh-Hans：{useLocale().t('_c.ok')}</p>
				<p>这是全局配置项的值：{l.locale.toString()}</p>
				<Button.Root onclick={() => accessor.setLocale('en')}>en</Button.Root>
				<Button.Root onclick={() => accessor.setLocale('zh-Hans')}>zh-Hans</Button.Root>
			</LocaleProvider>
		</div>
	);
}
