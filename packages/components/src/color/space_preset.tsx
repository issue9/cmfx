// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { For, type JSX } from 'solid-js';

import { joinClass } from '@components/base';
import type { Accessor, ColorSpace } from './space';
import styles from './style.module.css';

/**
 * 用户自己提供一系列颜色的 {@link ColorSpace} 实现
 */
export class PresetSpace implements ColorSpace {
	readonly #values: Array<string>;

	/**
	 * 构造函数
	 *
	 * @param presets - 预设值列表；
	 */
	constructor(...presets: Array<string>) {
		this.#values = presets;
	}

	get id(): string {
		return 'preset';
	}

	get localeID(): string {
		return '_c.color.preset';
	}

	include(value: string): boolean {
		return this.#values.includes(value);
	}

	panel(access: Accessor, _: HTMLElement): JSX.Element {
		return (
			<div class={styles.presets}>
				<For each={this.#values}>
					{v => (
						<button
							type="button"
							class={joinClass(undefined, styles.color, access.getValue() === v ? styles.selected : '')}
							style={{ background: v }}
							title={v}
							onclick={() => {
								access.setValue(v);
							}}
						/>
					)}
				</For>
			</div>
		);
	}
}
