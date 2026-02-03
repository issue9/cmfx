// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import IntlMessageFormat from 'intl-messageformat';

import { flatten } from '@core/types';
import { Dict, DictKeys, Loader } from './dict';
import { DisplayStyle, Locale, TranslateArgs } from './locale';
import { match } from './match';

/**
 * 提供本地化相关的功能
 */
export class I18n implements Locale {
	static #fallback: string;
	static #messages: Map<string, Map<string, IntlMessageFormat>> = new Map();

	/**
	 * 初始化
	 *
	 * @param fallback - 在找不到对应在的语言时采用的默认值；
	 */
	static init(fallback: string) {
		I18n.#fallback = fallback;
	}

	static get fallback(): string {
		return I18n.#fallback;
	}

	/**
	 * 创建一个用于缓存本地化对象的接口
	 *
	 * @remarks
	 * 对于一些引入的第三方库，其本身可能提供了本地化的相关数据，但是又没有能力同时加载多个语言环境，比如 zod。
	 * 当前方法返回的对象可以保存这些数据，以便在需要时直接使用，而无需再次加载。
	 * @param id - 唯一 ID，一般直接使用包名即可；
	 * @typeParam T - 缓存对象的类型；
	 */
	static createObject<T>() {
		const obj = new Map<string, T>();

		function get(locale: string): T | undefined;
		function get(locale: string, init: () => T): T;
		function get(locale: string, init?: () => T): T | undefined {
			const o = obj.get(locale);
			if (o) {
				return o;
			}

			if (init) {
				const o = init();
				obj.set(locale, o);
				return o;
			} else {
				// 若不存在初始化方法，则查找最匹配的项作为返回值
				const id = match(locale, Array.from(obj.keys()), I18n.fallback, { localeMatcher: 'best fit' });
				return obj.get(id);
			}
		}

		return {
			/**
			 * 获取指定语言的缓存对象
			 *
			 * @param locale - 语言标识符，如 'en-US' 或 'zh-CN'；
			 * @param init - 当缓存中不存在指定语言的缓存对象时，调用该函数以初始化该对象；
			 */
			get,

			/**
			 * 设置指定语言的缓存对象
			 *
			 * @param locale - 语言标识符，如 'en-US' 或 'zh-CN'；
			 * @param o - 缓存对象；
			 */
			set(locale: string, o: T): void {
				obj.set(locale, o);
			},

			/**
			 * 返回所有的语言 ID
			 */
			locales(): Array<string> {
				return Array.from(obj.keys());
			},

			/**
			 * 销毁指定语言的缓存对象
			 *
			 * @param locale - 语言标识符，如 'en-US' 或 'zh-CN'，如果未指定表示销毁所有；
			 */
			destroy(locale?: string): void {
				if (locale) {
					obj.delete(locale);
				} else {
					obj.clear();
				}
			},
		};
	}

	/**
	 * 支持的语言数量
	 */
	static languageSize(): number {
		return I18n.#messages.size;
	}

	/**
	 * 支持语言列表
	 */
	static languages(): Array<string> {
		return [...I18n.#messages.keys()];
	}

	/**
	 * 以 locale 的指定的语言翻译 key 指向的内容
	 *
	 * @typeParam D - 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
	 */
	static translate<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
		const msgs = I18n.#messages.get(I18n.matchLanguage(locale));
		if (!msgs) {
			return key as string;
		}

		const f = msgs.get(key as string);
		return (f ? f.format(args) : key) as string;
	}

	/**
	 * 在当前支持的语言中找出与 l 最匹配的语言
	 */
	static matchLanguage(l: string): string {
		if (I18n.#messages.has(l)) {
			return l;
		}
		return match(l, I18n.languages(), I18n.#fallback, { localeMatcher: 'best fit' });
	}

	/**
	 * 添加支持的语言及他它的翻译对象的加载方法
	 */
	static async addDict(locale: string, ...loaders: Array<Loader>): Promise<void> {
		let msgs: Map<string, IntlMessageFormat>;
		if (I18n.#messages.has(locale)) {
			msgs = I18n.#messages.get(locale)!;
		} else {
			msgs = new Map<string, IntlMessageFormat>();
		}

		for (const loader of loaders) {
			const dict = await loader(locale);
			if (dict) {
				Object.entries<string>(flatten(dict)).forEach(item => {
					try {
						msgs.set(item[0], new IntlMessageFormat(item[1], locale));
					} catch (err) {
						throw new Error(`解析 ${item[1]} 是出现了错误 ${err}`);
					}
				});
			}
		}
		I18n.#messages.set(locale, msgs);
	}

	/**
	 * 删除对某个语言的支持
	 */
	static delDict(locale: string) {
		I18n.#messages.delete(locale);
	}

	///////////////////////// 以下为实例字段 /////////////////////////

	readonly #current: Map<string, IntlMessageFormat>;
	readonly #locale: Intl.Locale;
	readonly #displayStyle: DisplayStyle;

	readonly #dtStyle: Intl.DateTimeFormatOptions['timeStyle'];
	readonly #durationStyle: Intl.RelativeTimeFormatOptions['style'];
	readonly #numberStyle: Intl.NumberFormatOptions['unitDisplay'];

	readonly #displayNames: Intl.DisplayNames;
	readonly #timezone: string;

	/**
	 * 构造函数
	 * @param locale - 本地化字符串；
	 * @param style - 显示风格；
	 * @param tz - 时区，如果为空则采用 `Intl.DateTimeFormat().resolvedOptions().timeZone`；
	 */
	constructor(locale: string, style: DisplayStyle, tz?: string) {
		locale = I18n.matchLanguage(locale); // 找出当前支持的语言中与参数指定最匹配的项
		const curr = I18n.#messages.get(locale);
		if (curr) {
			this.#current = curr;
		} else {
			this.#current = new Map();
		}

		this.#locale = new Intl.Locale(locale);

		this.#displayStyle = style;
		switch (style) {
			case 'full':
				this.#dtStyle = 'full';
				this.#durationStyle = 'long';
				this.#numberStyle = 'long';
				break;
			case 'short':
				this.#dtStyle = 'medium';
				this.#durationStyle = 'short';
				this.#numberStyle = 'short';
				break;
			case 'narrow':
				this.#dtStyle = 'short';
				this.#durationStyle = 'narrow';
				this.#numberStyle = 'narrow';
				break;
			default:
				throw `参数 style 的值无效 ${style}`;
		}
		this.#displayNames = new Intl.DisplayNames(this.locale, { type: 'language', languageDisplay: 'dialect' });

		this.#timezone = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	get locale(): Intl.Locale {
		return this.#locale;
	}

	get displayStyle(): DisplayStyle {
		return this.#displayStyle;
	}

	get timezone(): string {
		return this.#timezone;
	}

	datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
		if (!o) {
			o = { timeStyle: this.#dtStyle, dateStyle: this.#dtStyle, timeZone: this.timezone };
		} else {
			if (!o.dateStyle) {
				o.dateStyle = this.#dtStyle;
			}
			if (!o.timeStyle) {
				o.timeStyle = this.#dtStyle;
			}
			if (!o.timeZone) {
				o.timeZone = this.timezone;
			}
		}

		return new Intl.DateTimeFormat(this.locale, o);
	}

	dateFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
		if (!o) {
			o = { dateStyle: this.#dtStyle, timeZone: this.timezone };
		} else {
			if (!o.dateStyle) {
				o.dateStyle = this.#dtStyle;
			}
			if (!o.timeZone) {
				o.timeZone = this.timezone;
			}
		}
		o.timeStyle = undefined;

		return new Intl.DateTimeFormat(this.locale, o);
	}

	timeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
		if (!o) {
			o = { timeStyle: this.#dtStyle, timeZone: this.timezone };
		} else {
			if (!o.timeStyle) {
				o.timeStyle = this.#dtStyle;
			}
			if (!o.timeZone) {
				o.timeZone = this.timezone;
			}
		}
		o.dateStyle = undefined;

		return new Intl.DateTimeFormat(this.locale, o);
	}

	numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat {
		if (!o) {
			o = { unitDisplay: this.#numberStyle };
		} else if (!o.unitDisplay) {
			o.unitDisplay = this.#numberStyle;
		}

		return new Intl.NumberFormat(this.locale, o);
	}

	durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat {
		if (!o) {
			o = { style: this.#durationStyle };
		} else if (!o.style) {
			o.style = this.#durationStyle;
		}

		return new (Intl as any).DurationFormat(this.locale, o);
	}

	relativeTimeFormat(o?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
		if (!o) {
			o = { style: this.#durationStyle };
		} else if (!o.style) {
			o.style = this.#durationStyle; // style 与 durationFormat 的取值相同
		}

		return new Intl.RelativeTimeFormat(this.locale, o);
	}

	match(locales: Array<string>, preset: string) {
		return match(this.locale.toString(), locales, preset);
	}

	get locales() {
		const loc: Array<[string, string]> = [];
		I18n.#messages.forEach((_, key) => {
			loc.push([key, this.#displayNames.of(key)!]);
		});
		return loc;
	}

	t<D extends Dict>(key: string | DictKeys<D>, args?: TranslateArgs): string {
		const f = this.#current.get(key as string);
		return (f ? f.format(args) : key) as string;
	}

	tt<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
		return I18n.translate(locale, key, args);
	}
}
