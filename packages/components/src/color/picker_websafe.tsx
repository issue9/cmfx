// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { For, type JSX, type Signal } from 'solid-js';

import { joinClass } from '@components/base';
import type { PickerPanel } from './picker';
import styles from './style.module.css';

const chars = ['0', '3', '6', '9', 'c', 'f'] as const;

const values = chars.flatMap(v1 => chars.flatMap(v2 => chars.map(v3 => `#${v1}${v2}${v3}`)));

/**
 * web 安全色的 {@link PickerPanel} 实现
 */
export class WebSafePickerPanel implements PickerPanel {
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
		return 'websafe';
	}

	get localeID(): string {
		return '_c.color.websafe';
	}

	include(value: string): boolean {
		return values.includes(value);
	}

	panel(s: Signal<string>): JSX.Element {
		return (
			<div class={styles.vars}>
				<For each={values}>
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
