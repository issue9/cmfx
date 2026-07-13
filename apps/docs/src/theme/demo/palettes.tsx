// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Color } from '@cmfx/components';
import { joinClass, type Palette, palettes } from '@cmfx/themes';
import { createEffect, createSignal, For, type JSX } from 'solid-js';

import type { SchemeStore } from '@docs/theme/utils';
import styles from './style.module.css';

export type Contrast = 'more' | 'less' | 'none';

export function Palettes(props: { s: SchemeStore; c: Contrast; apca?: boolean }): JSX.Element {
	return (
		<div class={styles.palettes}>
			<For each={palettes}>{p => <PaletteBlocks p={p} s={props.s} c={props.c} apca={props.apca} />}</For>
		</div>
	);
}

function PaletteBlocks(props: { p: Palette; s: SchemeStore; c: Contrast, apca?: boolean }): JSX.Element {
	const raw = props.s[0];

	let baseRef: HTMLDivElement;
	let lowRef: HTMLDivElement;
	let highRef: HTMLDivElement;
	let disabledRef: HTMLDivElement;
	let focusedRef: HTMLDivElement;
	let activedRef: HTMLDivElement;
	let selectedRef: HTMLDivElement;
	const [baseWCAG, setBaseWCAG] = createSignal('');
	const [lowWCAG, setLowWCAG] = createSignal('');
	const [highWCAG, setHighWCAG] = createSignal('');
	const [disabledWCAG, setDisabledWCAG] = createSignal('');
	const [focusedWCAG, setFocusedWCAG] = createSignal('');
	const [activedWCAG, setActivedWCAG] = createSignal('');
	const [selectedWCAG, setSelectedWCAG] = createSignal('');

	createEffect(() => {
		void raw[props.p];
		void props.c;

		const baseS = window.getComputedStyle(baseRef);
		setBaseWCAG(Color.wcag(baseS.getPropertyValue('background-color'), baseS.getPropertyValue('color'), props.apca));

		const lowS = window.getComputedStyle(lowRef);
		setLowWCAG(Color.wcag(lowS.getPropertyValue('background-color'), lowS.getPropertyValue('color'), props.apca));

		const highS = window.getComputedStyle(highRef);
		setHighWCAG(Color.wcag(highS.getPropertyValue('background-color'), highS.getPropertyValue('color'), props.apca));

		const disabledS = window.getComputedStyle(disabledRef);
		setDisabledWCAG(Color.wcag(disabledS.getPropertyValue('background-color'), disabledS.getPropertyValue('color'), props.apca));

		const focusedS = window.getComputedStyle(focusedRef);
		setFocusedWCAG(Color.wcag(focusedS.getPropertyValue('background-color'), focusedS.getPropertyValue('color'), props.apca));

		const activedS = window.getComputedStyle(activedRef);
		setActivedWCAG(Color.wcag(activedS.getPropertyValue('background-color'), activedS.getPropertyValue('color'), props.apca));

		const selectedS = window.getComputedStyle(selectedRef);
		setSelectedWCAG(Color.wcag(selectedS.getPropertyValue('background-color'), selectedS.getPropertyValue('color'), props.apca));
	});

	return (
		<div class={styles.palette}>
			<p class={styles.name}>{props.p}</p>
			<div ref={el => (baseRef = el)} class={joinClass(undefined, styles.color, styles[props.p])}>
				base:{baseWCAG()}
			</div>
			<div ref={el => (lowRef = el)} class={joinClass(undefined, styles.color, styles[`${props.p}-low`])}>
				low:{lowWCAG()}
			</div>
			<div ref={el => (highRef = el)} class={joinClass(undefined, styles.color, styles[`${props.p}-high`])}>
				high:{highWCAG()}
			</div>
			<div class={styles.exts}>
				<div
					ref={el => (disabledRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-disabled`])}
				>
					disabled:{disabledWCAG()}
				</div>
				<div
					ref={el => (focusedRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-focused`])}
				>
					focused:{focusedWCAG()}
				</div>
				<div
					ref={el => (activedRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-actived`])}
				>
					actived:{activedWCAG()}
				</div>
				<div
					ref={el => (selectedRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-selected`])}
				>
					selected:{selectedWCAG()}
				</div>
			</div>
		</div>
	);
}
