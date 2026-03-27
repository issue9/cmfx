// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Dict, DictKeys, DisplayStyle, Locale, TranslateArgs } from '@cmfx/core';
import { I18n } from '@cmfx/core';
import type { Accessor, JSX, ParentProps } from 'solid-js';
import { createContext, createEffect, createSignal, useContext } from 'solid-js';

import { ContextNotFoundError } from '@components/context/errors';

export type Props = ParentProps<{
	/**
	 * 语言 ID
	 *
	 * @reactive
	 */
	id: string;

	/**
	 * 一些数据的显示风格
	 *
	 * @reactive
	 */
	displayStyle?: DisplayStyle;

	/**
	 * 时区信息
	 *
	 * @remarks
	 * 该值必须是当前浏览器的 `Intl.supportedValuesOf('timeZone')` 的返回值之一。
	 *
	 * @reactive
	 */
	timezone?: string;
}>;

const localeContext = createContext<Accessor<Locale>>();

/**
 * 返回用于本地化的对象
 */
export function useLocale(): Locale {
	const ctx = useContext(localeContext);
	if (!ctx) {
		throw new ContextNotFoundError('localeContext');
	}

	return {
		get locale(): Intl.Locale {
			return ctx().locale;
		},
		get displayStyle(): DisplayStyle {
			return ctx().displayStyle;
		},
		get timezone(): string {
			return ctx().timezone;
		},
		datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
			return ctx().datetimeFormat(o);
		},
		dateFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
			return ctx().dateFormat(o);
		},
		timeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
			return ctx().timeFormat(o);
		},
		numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat {
			return ctx().numberFormat(o);
		},
		durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat {
			return ctx().durationFormat(o);
		},
		relativeTimeFormat(o?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
			return ctx().relativeTimeFormat(o);
		},
		match(locales: Array<string>, preset: string): string {
			return ctx().match(locales, preset);
		},
		get locales(): [id: string, displayName: string][] {
			return ctx().locales;
		},
		t<D extends Dict>(key: string | DictKeys<D>, args?: TranslateArgs): string {
			return ctx().t(key, args);
		},
		tt<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
			return ctx().tt(locale, key, args);
		},
	};
}

/**
 * 指定本地化对象
 *
 * @remarks
 * 除去 children 之外的可选属性，如果未指定，会尝试向上一层的 `<LocaleProvider>` 组件查找对应的值。
 */
export function LocaleProvider(props: ParentProps<Props>): JSX.Element {
	// 顶层的 LocaleProvider 由 OptionsProvider 调用，必须提供完整的参数，
	// 所以后续所有属性都可以从顶层对象获取当前实例不存在的参数并合并入当前实例。

	const p = useContext(localeContext);
	const parent = p ? p() : undefined;

	const [get, set] = createSignal<Locale>(
		new I18n(
			props.id,
			props.displayStyle ?? parent!.displayStyle, // 如果 props.displayStyle 为空，则必存在 parent.displayStyle
			props.timezone ?? parent!.timezone,
		),
	);

	createEffect(() => {
		set(
			new I18n(
				props.id,
				props.displayStyle ?? parent!.displayStyle, // 如果 props.displayStyle 为空，则必存在 parent.displayStyle
				props.timezone ?? parent!.timezone,
			),
		);
	});

	return <localeContext.Provider value={get}>{props.children}</localeContext.Provider>;
}
