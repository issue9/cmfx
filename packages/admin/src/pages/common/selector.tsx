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
    ['male', '_i.page.sexes.male'],
    ['female', '_i.page.sexes.female'],
    ['unknown', '_i.page.sexes.unknown'],
] as const;

export const statesMap: Array<[State, MessagesKey]> = [
    ['normal', '_i.page.states.normal'],
    ['locked', '_i.page.states.locked'],
    ['deleted', '_i.page.states.deleted'],
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
