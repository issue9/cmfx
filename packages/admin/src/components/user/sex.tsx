// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, Enums, useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { Sex } from '@/context';
import { MessagesKey } from '@/messages';

export const sexes: Enums<Sex, MessagesKey> = [
    ['male', '_p.sexes.male'],
    ['female', '_p.sexes.female'],
    ['unknown', '_p.sexes.unknown'],
] as const;

export type SexSelectorProps<M extends boolean> = Omit<ChoiceProps<Sex, M>, 'options'>;

/**
 * 性别选择框
 */
export function SexSelector<M extends boolean>(props: SexSelectorProps<M>): JSX.Element {
    const l = useLocale();
    return <Choice options={sexes.map(([value, key]) => ({ type: 'item', value, label: l.t(key) }))} {...props} />;
}
