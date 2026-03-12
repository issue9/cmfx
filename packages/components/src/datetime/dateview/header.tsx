// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Locale } from '@cmfx/core';
import { Accessor, createMemo, JSX, untrack } from 'solid-js';
import IconPrevMonth from '~icons/material-symbols/chevron-left';
import IconNextMonth from '~icons/material-symbols/chevron-right';
import IconPrevYear from '~icons/material-symbols/keyboard-double-arrow-left';
import IconNextYear from '~icons/material-symbols/keyboard-double-arrow-right';
import IconToday from '~icons/material-symbols/today';

import { Button, ButtonGroup } from '@components/button';
import { MonthPanel } from '@components/datetime/monthpanel';
import styles from './style.module.css';
import { API, Props } from './types';

export function buildHeader(l: Locale, value: Accessor<Date>, api: API, props: Props): JSX.Element {
	const monthFormatter = createMemo(() => {
		const s = l.displayStyle === 'full' ? 'long' : l.displayStyle === 'short' ? 'short' : 'narrow';
		return new Intl.DateTimeFormat(l.locale, { month: s, year: 'numeric' });
	});

	let month: MonthPanel.RootRef;
	let monthVisible = false;

	return (
		<header>
			<p>
				<span
					// biome-ignore lint/a11y/noNoninteractiveTabindex: tabIndex
					tabIndex={0}
					onclick={e => {
						monthVisible = month.root().togglePopover();
						adjustPopoverPosition(month.root(), e.currentTarget.getBoundingClientRect());
					}}
				>
					{monthFormatter().format(value())}
				</span>
			</p>

			<MonthPanel.Root
				palette={props.palette}
				popover="auto"
				ref={el => {
					month = el;
				}}
				min={props.min}
				max={props.max}
				value={untrack(value)}
				onChange={m => {
					if (!m) {
						return;
					}
					api.jump(m);
					if (monthVisible) {
						month.root().hidePopover();
						monthVisible = false;
					}
				}}
			/>

			<ButtonGroup.Root kind="flat" disabled={props.disabled} class={styles.actions}>
				<Button.Root
					title={l.t('_c.date.prevYear')}
					square
					disabled={!api.canOffset(-1, 0)}
					onclick={() => {
						if (!props.readonly && !props.disabled) {
							api.offset(-1, 0);
						}
					}}
				>
					<IconPrevYear />
				</Button.Root>
				<Button.Root
					title={l.t('_c.date.prevMonth')}
					square
					disabled={!api.canOffset(0, -1)}
					onclick={() => {
						if (!props.readonly && !props.disabled) {
							api.offset(0, -1);
						}
					}}
				>
					<IconPrevMonth />
				</Button.Root>

				<Button.Root
					title={l.t('_c.date.thisMonth')}
					square
					disabled={!api.canJump(new Date())}
					onclick={() => {
						if (!props.readonly && !props.disabled) {
							api.jump(new Date());
						}
					}}
				>
					<IconToday />
				</Button.Root>

				<Button.Root
					title={l.t('_c.date.followingMonth')}
					square
					disabled={!api.canOffset(0, 1)}
					onclick={() => {
						if (!props.readonly && !props.disabled) {
							api.offset(0, 1);
						}
					}}
				>
					<IconNextMonth />
				</Button.Root>
				<Button.Root
					title={l.t('_c.date.followingYear')}
					square
					disabled={!api.canOffset(1, 0)}
					onclick={() => {
						if (!props.readonly && !props.disabled) {
							api.offset(1, 0);
						}
					}}
				>
					<IconNextYear />
				</Button.Root>
			</ButtonGroup.Root>
		</header>
	);
}
