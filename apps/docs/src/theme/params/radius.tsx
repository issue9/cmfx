// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Divider, Form, RadioGroup } from '@cmfx/components';
import type { Locale } from '@cmfx/core';
import type { Radius } from '@cmfx/themes';
import type { JSX } from 'solid-js';
import IconRadius from '~icons/mingcute/border-radius-fill';

import type { SchemeStore } from '@docs/theme/utils';
import styles from './style.module.css';

/**
 * 设置圆角孤度参数面板
 */
export function radiusParams(l: Locale, s: SchemeStore): JSX.Element {
	return (
		<div class={styles.param}>
			<Divider>
				<IconRadius class="me-1" />
				{l.t('_d.theme.radius')}
			</Divider>
			{radius('xs', s, 'xs')}
			{radius('sm', s, 'sm')}
			{radius('md', s, 'md')}
			{radius('lg', s, 'lg')}
			{radius('xl', s, 'xl')}
		</div>
	);
}

// 可用的圆角值
export const radiusValues = [0, 0.25, 0.5, 1, 1.5, 2] as const;

function radius(title: string, s: SchemeStore, a: keyof Radius): JSX.Element {
	const radiusLabel = (radius: number): JSX.Element => {
		return (
			<div class={styles.btns}>
				<div style={{ 'border-top-left-radius': `${radius}rem` }} />
			</div>
		);
	};

	return (
		<div class={styles.radius}>
			<Form.Field label={<span class={styles.title}>{title}</span>}>
				<RadioGroup
					class="w-full"
					value={s[0].radius[a]}
					// biome-ignore lint/suspicious/noExplicitAny: any
					onChange={v => s[1]('radius', a as never, v ?? (0 as any))}
					block
					options={radiusValues.map(v => ({ value: v, label: radiusLabel(v) }))}
				/>
			</Form.Field>
		</div>
	);
}
