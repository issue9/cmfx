// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, useLocale } from '@cmfx/components';
import { I18n, Locale } from '@cmfx/core';
import { createMemo, JSX } from 'solid-js';

import { Sex } from '@/schemas';

const localeObjects = I18n.createObject<Array<{type: 'item', value: Sex, label: string}>>();

/**
 * 返回本地化的性别列表
 */
export function localeSexes(l: Locale) {
    return localeObjects.get(l.locale.toString(), () => ([
        { type: 'item', value: 'male', label: l.t('_p.sexes.male') },
        { type: 'item', value: 'female', label: l.t('_p.sexes.female') },
        { type: 'item', value: 'unknown', label: l.t('_p.sexes.unknown') },
    ]));
}

export type SexSelectorProps<M extends boolean> = Omit<ChoiceProps<Sex, M>, 'options'>;

/**
 * 性别选择框
 */
export function SexSelector<M extends boolean>(props: SexSelectorProps<M>): JSX.Element {
    const l = useLocale();
    const sexes = createMemo(() => localeSexes(l));
    return <Choice options={sexes()} {...props} />;
}
