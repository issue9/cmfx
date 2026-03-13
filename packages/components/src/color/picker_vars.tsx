// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { For, type JSX, type Signal } from 'solid-js';

import { joinClass } from '@components/base';
import type { PickerPanel } from './picker';
import styles from './style.module.css';

const names = [
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
	'slate',
	'gray',
	'zinc',
	'neutral',
	'stone',
] as const;

const values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 950] as const;

const vars = values.flatMap(val => names.map(name => `var(--color-${name}-${val})`));

/**
 * tailwind 提供的颜色列表 {@link PickerPanel} 实现
 */
export class TailwindVarsPickerPanel implements PickerPanel {
	readonly #disabled: Array<string> = [];

	/**
	 * 构造函数
	 *
	 * @param disabled - 禁用的颜色列表；
	 */
	constructor(...disabled: Array<string>) {
		this.#disabled = disabled ?? [];
	}

	get id(): string {
		return 'tailwind';
	}

	get localeID(): string {
		return '_c.color.vars';
	}

	include(value: string): boolean {
		return vars.includes(value);
	}

	panel(s: Signal<string>): JSX.Element {
		return (
			<div class={styles.vars}>
				<For each={vars}>
					{v => {
						const cls = joinClass(
							undefined,
							styles.color,
							v === s[0]() ? styles.selected : '',
							this.#disabled.includes(v) ? styles.disabled : '',
						);

						return (
							<span
								class={cls}
								style={{ background: v }}
								title={v}
								onclick={() => {
									if (this.#disabled.includes(v)) {
										return;
									}
									s[1](v);
								}}
							/>
						);
					}}
				</For>
			</div>
		);
	}
}
