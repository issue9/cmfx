// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, Enums, translateEnums2Options, useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { User } from '@/context';
import { MessagesKey } from '@/messages';

export type Sex = User['sex'];

export const sexes: Enums<Sex, MessagesKey> = [
    ['male', '_i.sexes.male'],
    ['female', '_i.sexes.female'],
    ['unknown', '_i.sexes.unknown'],
] as const;

export type SexSelectorProps<M extends boolean> = Omit<ChoiceProps<Sex, M>, 'options'>;

/**
 * 性别选择框
 */
export function SexSelector<M extends boolean>(props: SexSelectorProps<M>): JSX.Element {
    const l = useLocale();
    return <Choice options={translateEnums2Options<Sex>(sexes, l)} {...props} />;
}
