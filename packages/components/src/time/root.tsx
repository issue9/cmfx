// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createSignal, createUniqueId, type JSX, mergeProps, Show, untrack } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import { useLocale } from '@components/context';
import { TimePanel } from '@components/datetime';
import { Form } from '@components/form';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props
	extends Form.DataProps<Date>,
		BaseProps,
		Omit<TimePanel.RootProps, 'onChange' | 'value' | 'popover' | 'ref'>,
		RefProps<Ref> {
	placeholder?: string;
}

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
	const ab = anchor.getBoundingClientRect();
	const ret = popElem.togglePopover();
	adjustPopoverPosition(popElem, ab, 2);
	return ret;
}

export function Root(props: Props): JSX.Element {
	const l = useLocale();

	const field = Form.useField(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const [hover, setHover] = createSignal(false);

	let panelRef: TimePanel.RootRef;
	let anchorRef: HTMLElement;

	const id = createUniqueId();

	const formatter = createMemo(
		() =>
			new Intl.DateTimeFormat(l.locale, {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			}),
	);

	return (
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: Mouse 事件上是为了达到 label 效果 */}
			<div
				ref={el => {
					anchorRef = el;
				}}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef.root())}
				class={joinClass(undefined, styles['activator-container'], props.rounded ? styles.rounded : '')}
				aria-haspopup
			>
				<input
					id={id}
					class={styles.input}
					tabIndex={props.tabindex}
					disabled={props.disabled}
					readOnly
					placeholder={props.placeholder}
					value={field.getValue() ? formatter().format(field.getValue()) : ''}
				/>
				<Show when={hover() && field.getValue()} fallback={<IconExpandAll />}>
					<IconClose
						onClick={(e: MouseEvent) => {
							e.stopPropagation();
							field.setValue(undefined);
						}}
					/>
				</Show>
			</div>

			<TimePanel.Root
				popover="auto"
				ref={el => (panelRef = el)}
				disabled={props.disabled}
				readonly={props.readonly}
				value={field.getValue()}
				onChange={val => {
					const old = untrack(field.getValue);
					if (old === val) {
						return;
					}
					field.setValue(val);
				}}
			/>
		</>
	);
}
