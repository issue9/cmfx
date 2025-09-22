// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, Enums, useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { User } from '@/context';
import { MessagesKey } from '@/messages';

export type State = User['state'];

export const states: Enums<State, MessagesKey> = [
    ['normal', '_p.states.normal'],
    ['locked', '_p.states.locked'],
    ['deleted', '_p.states.deleted'],
] as const;

export type StateSelectorProps<M extends boolean> = Omit<ChoiceProps<State, M>, 'options'>;

/**
 * 用户状态选择框
 */
export function StateSelector<M extends boolean>(props: StateSelectorProps<M>): JSX.Element {
    const l = useLocale();
    return <Choice options={states.map(([value, key]) => ({ type: 'item', value, label: l.t(key) }))} {...props} />;
}
