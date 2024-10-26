// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { buildEnumsOptions, Choice, ChoiceProps } from '@/components';
import { Sex, sexesMap, State, statesMap } from './types';

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
