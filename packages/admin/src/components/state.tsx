// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, useLocale } from '@cmfx/components';
import { I18n, Locale } from '@cmfx/core';
import { createMemo, JSX } from 'solid-js';

import { State } from '@admin/schemas';

const localeObjects = I18n.createObject<Array<{ type: 'item'; value: State; label: string }>>();

/**
 * 返回本地化的性别列表
 */
export function localeStates(l: Locale) {
	return localeObjects.get(l.locale.toString(), () => [
		{ type: 'item', value: 'normal', label: l.t('_p.states.normal') },
		{ type: 'item', value: 'locked', label: l.t('_p.states.locked') },
		{ type: 'item', value: 'deleted', label: l.t('_p.states.deleted') },
	]);
}

export type StateSelectorProps<M extends boolean> = Omit<ChoiceProps<State, M>, 'options'>;

/**
 * 用户状态选择框
 */
export function StateSelector<M extends boolean>(props: StateSelectorProps<M>): JSX.Element {
	const l = useLocale();
	const states = createMemo(() => localeStates(l));
	return <Choice options={states()} {...props} />;
}
