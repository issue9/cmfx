// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, useLocale } from '@cmfx/components';
import { I18n, Locale } from '@cmfx/core';
import { createMemo, JSX } from 'solid-js';

import { Sex } from '@admin/schemas';

const localeObjects = I18n.createObject<Array<{ type: 'item'; value: Sex; label: string }>>();

/**
 * 返回本地化的性别列表
 */
export function localeSexes(l: Locale) {
	return localeObjects.get(l.locale.toString(), () => [
		{ type: 'item', value: 'male', label: l.t('_p.sexes.male') },
		{ type: 'item', value: 'female', label: l.t('_p.sexes.female') },
		{ type: 'item', value: 'unknown', label: l.t('_p.sexes.unknown') },
	]);
}

type P = ChoiceProps<Sex>;

interface SProps extends Omit<Extract<P, { multiple?: false }>, 'options'> {}

interface MProps extends Omit<Extract<P, { multiple: true }>, 'options'> {}

export type SexSelectorProps = SProps | MProps;

/**
 * 性别选择框
 */
export function SexSelector(props: SexSelectorProps): JSX.Element {
	const l = useLocale();
	const sexes = createMemo(() => localeSexes(l));
	return <Choice {...props} options={sexes()} />;
}
