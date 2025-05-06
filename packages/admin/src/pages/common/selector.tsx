// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, translateEnums2Options, useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { User } from '@/context';
import { MessagesKey } from '@/messages';

export type Sex = User['sex'];

export type State = User['state'];

export const sexesMap: Array<[Sex, MessagesKey]> = [
    ['male', '_i.sexes.male'],
    ['female', '_i.sexes.female'],
    ['unknown', '_i.sexes.unknown'],
] as const;

export const statesMap: Array<[State, MessagesKey]> = [
    ['normal', '_i.states.normal'],
    ['locked', '_i.states.locked'],
    ['deleted', '_i.states.deleted'],
] as const;

export type SexSelectorProps<M extends boolean> = Omit<ChoiceProps<Sex, M>, 'options'>;

/**
 * 性别选择框
 */
export function SexSelector<M extends boolean>(props: SexSelectorProps<M>): JSX.Element {
    const l = useLocale();
    return <Choice options={translateEnums2Options<Sex>(sexesMap, l)} {...props} />;
}

export type StateSelectorProps<M extends boolean> = Omit<ChoiceProps<State, M>, 'options'>;

/**
 * 用户状态选择框
 */
export function StateSelector<M extends boolean>(props: StateSelectorProps<M>): JSX.Element {
    return <Choice options={translateEnums2Options<State>(statesMap, useLocale())} {...props} />;
}
