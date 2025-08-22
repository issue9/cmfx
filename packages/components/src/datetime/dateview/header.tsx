// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { Accessor, createMemo, JSX, untrack } from 'solid-js';
import IconPrevMonth from '~icons/material-symbols/chevron-left';
import IconNextMonth from '~icons/material-symbols/chevron-right';
import IconPrevYear from '~icons/material-symbols/keyboard-double-arrow-left';
import IconNextYear from '~icons/material-symbols/keyboard-double-arrow-right';
import IconToday from '~icons/material-symbols/today';

import { Locale } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { MonthPanel } from '@/datetime/monthpanel';
import styles from './style.module.css';
import { Props, Ref } from './types';

export function buildHeader(l: Locale, value: Accessor<Date>, ref: Ref, props: Props): JSX.Element {
    const monthFormatter = createMemo(() => {
        const s = l.displayStyle === 'full' ? 'long' : (l.displayStyle === 'short' ? 'short' : 'narrow');
        return new Intl.DateTimeFormat(l.locale, { month: s, year: 'numeric' });
    });

    let month: HTMLFieldSetElement;
    let monthVisible = false;

    return <header>
        <p>
            <span tabIndex={0} onClick={e => {
                monthVisible = month.togglePopover();
                adjustPopoverPosition(month, e.currentTarget.getBoundingClientRect());
            }}>{monthFormatter().format(value())}</span>
        </p>

        <MonthPanel palette={props.palette} popover='auto' ref={el => month = el}
            min={props.min} max={props.max} value={untrack(value)}
            onChange={m => {
                if (!m) { return; }
                ref.jump(m);
                if (monthVisible) {
                    month.hidePopover();
                    monthVisible = false;
                }
            }}
        />

        <ButtonGroup kind='flat' disabled={props.disabled} class={styles.actions}>
            <Button title={l.t('_c.date.prevYear')} square disabled={!ref.canOffset(-1, 0)}
                onClick={() => {
                    if (!props.readonly && !props.disabled) { ref.offset(-1, 0); }
                }}><IconPrevYear /></Button>
            <Button title={l.t('_c.date.prevMonth')} square disabled={!ref.canOffset(0, -1)}
                onClick={() => {
                    if (!props.readonly && !props.disabled) { ref.offset(0, -1); }
                }}><IconPrevMonth /></Button>

            <Button title={l.t('_c.date.thisMonth')} square disabled={!ref.canJump(new Date())}
                onClick={() => {
                    if (!props.readonly && !props.disabled) { ref.jump(new Date()); }
                }}><IconToday /></Button>

            <Button title={l.t('_c.date.followingMonth')} square disabled={!ref.canOffset(0, 1)}
                onClick={() => {
                    if (!props.readonly && !props.disabled) { ref.offset(0, 1); }
                }}><IconNextMonth /></Button>
            <Button title={l.t('_c.date.followingYear')} square disabled={!ref.canOffset(1, 0)}
                onClick={() => {
                    if (!props.readonly && !props.disabled) { ref.offset(1, 0); }
                }}><IconNextYear /></Button>
        </ButtonGroup>
    </header>;
}
