// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp, User } from '@/app';
import { buildEnumsOptions, Choice, ChoiceProps } from '@/components';
import { MessagesKey } from '@/messages';

export type Sex = User['sex'];

export type State = User['state'];

export const sexesMap: Array<[Sex, MessagesKey]> = [
    ['male', '_i.page.sexes.male'],
    ['female', '_i.page.sexes.female'],
    ['unknown', '_i.page.sexes.unknown'],
] as const;

export const statesMap: Array<[State, MessagesKey]> = [
    ['normal', '_i.page.states.normal'],
    ['locked', '_i.page.states.locked'],
    ['deleted', '_i.page.states.deleted'],
];

export type SexSelectorProps<M extends boolean> = Omit<ChoiceProps<Sex, M>,'options'>;

/**
 * 性别选择框
 */
export function SexSelector<M extends boolean>(props: SexSelectorProps<M>): JSX.Element {
    const ctx = useApp();
    return <Choice options={buildEnumsOptions(sexesMap, ctx)} {...props} />;
}

export type StateSelectorProps<M extends boolean> = Omit<ChoiceProps<State, M>,'options'>;

/**
 * 用户状态选择框
 */
export function StateSelector<M extends boolean>(props: StateSelectorProps<M>): JSX.Element {
    const ctx = useApp();
    return <Choice options={buildEnumsOptions(statesMap, ctx)} {...props} />;
}