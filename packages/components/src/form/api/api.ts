// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flatten, Flattenable, FlattenKeys, Params, Problem, Validator } from '@cmfx/core';
import { flatten } from '@cmfx/core';
import { createSignal, untrack } from 'solid-js';
import { createStore, produce, reconcile, type SetStoreFunction, type Store, unwrap } from 'solid-js/store';

import type { Options } from './options';

// 用于在 API 中保存错误数据的类型
type Err<T extends Flattenable> = Record<FlattenKeys<T>, string | undefined>;

type StoreX<T extends Flattenable> = [get: Store<T>, set: SetStoreFunction<T>];

/**
 * 用于操作表单的 API
 *
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam P - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export class API<T extends Flattenable, R = never, P = never> {
	readonly #onProblem?: Options<T, R, P>['onProblem'];
	readonly #load?: Options<T, R, P>['load'];
	readonly #submit?: Options<T, R, P>['submit'];
	readonly #onSuccess?: Options<T, R, P>['onSuccess'];
	readonly #spinning = createSignal<boolean>(false);

	#flattenPreset: Flatten<T>; // 默认值的展开数据，方便检测是否为默认值
	#preset: T; // 保存当前数据的默认值，用于在表单重置时恢复默认值
	readonly #isPreset = createSignal(true);
	readonly #value: StoreX<T>;

	readonly #errs = createStore<Err<T>>({} as Err<T>); // 各个字段的错误信息存取
	readonly #globalErr = createSignal<string>(); // 全局错误信息

	readonly #validator?: Validator<T>;
	readonly #validOnChange?: boolean;

	/**
	 * 构造函数
	 */
	constructor(options: Options<T, R, P>) {
		this.#load = options.load;
		this.#onProblem = options.onProblem;
		this.#submit = options.submit;
		this.#onSuccess = options.onSuccess;

		// NOTE: 如果 options.initValue 是一个 createStore 创建的对象，无法复制其中的值作为默认值。
		this.#flattenPreset = flatten(options.initValue);
		this.#preset = options.initValue;
		this.#value = createStore<T>(structuredClone(options.initValue)); // 复制对象，防止与默认对象冲突。

		this.#validator = options.validator;
		this.#validOnChange = options.validOnChange;
	}

	/**
	 * 指定默认值
	 */
	setPreset(v: T) {
		this.#flattenPreset = flatten(v);
		this.#preset = v;
		this.#checkPreset();
	}

	/**
	 * 判断当前保存的值是否为默认值
	 *
	 * 这是一个响应式的值
	 */
	isPreset(): boolean {
		return this.#isPreset[0]();
	}

	/**
	 * 检测 #signal 中的值是否与默认值一致
	 */
	#checkPreset() {
		const keys = Object.keys(this.#flattenPreset);
		const vals = unwrap(this.#value[0]);

		for (const k of keys) {
			if (this.#flattenPreset[k] !== vals[k]) {
				this.#isPreset[1](false);
				return;
			}
		}
		this.#isPreset[1](true);
	}

	/**
	 * 返回当前关联的验证器
	 */
	validator(): Validator<T> | undefined {
		return this.#validator;
	}

	/**
	 * 验证数据并返回
	 *
	 * @returns 在 validator 不为空且验证出错的情况下，会返回 undefined，
	 * 其它情况下都将返回当前表单的最新值。
	 * 与 {@link getValue} 的区别在于当前方法的返回值由 {@link unwrap} 进行了解绑。
	 */
	async validValue(): Promise<T | undefined> {
		const v: T = unwrap(this.getValue());
		if (!this.#validator) {
			return v;
		}

		const rslt = await this.#validator.valid(v);
		this.setError(rslt[1]);
		if (!rslt[1]) {
			return rslt[0];
		}
	}

	/**
	 * 返回原始的存储对象
	 *
	 * @remarks
	 * 是一个由 {@link createStore} 创建的对象。是一个可响应式的对象。
	 */
	getValue(): Store<T> {
		return this.#value[0];
	}

	/**
	 * 修改整个对象的值
	 */
	setValue(obj: T) {
		const copy = structuredClone(obj);
		this.#value[1](copy);
		if (this.#validator) {
			this.#validator.valid(copy).then(rslt => {
				this.setError(rslt[1]);
			});
		}
		this.#checkPreset();
	}

	/**
	 * 将错误信息设置到指定的字段上
	 *
	 * @param errs - 错误列表，为空表示取消所有的错误显示，如果是字符串，表示未匹配的具体字段的错误；
	 */
	setError(errs?: Params<FlattenKeys<T>> | string) {
		if (!errs) {
			this.#errs[1](reconcile({} as Err<T>));
			this.#globalErr[1]();
			return;
		}

		if (typeof errs === 'string') {
			this.#globalErr[1](errs);
			return;
		}

		errs.forEach(param => {
			this.#errs[1]({ [param.name]: param.reason } as Err<T>);
		});
	}

	/**
	 * 返回表示当前整个对象的错误信息
	 */
	getError(k?: FlattenKeys<T>): string | undefined {
		return k ? this.#errs[0][k] : this.#globalErr[0]();
	}

	/**
	 * 重置所有字段的状态和值
	 */
	reset() {
		this.setError();
		this.#value[1](() => structuredClone(this.#preset));
		this.#checkPreset();
	}

	/**
	 * 创建对当前对象中某个字段的存取接口
	 *
	 * @param name - 字段名；
	 */
	createFieldAccessor<FT = Flatten<T>[FlattenKeys<T>]>(name: FlattenKeys<T>) {
		const parent = this;
		const path = name.split('.');

		const getValue = (): FT => {
			if (path.length === 1) {
				return parent.#value[0][name] as FT;
			}

			const v = path.reduce<FT | T>((acc, key) => {
				return key && acc ? ((acc as T)[key] as FT) : acc;
			}, parent.#value[0]);

			return (v ?? '') as FT;
		};

		const setError = (err?: string): void => {
			parent.setError(err ? [{ name, reason: err }] : undefined);
		};

		const setValue = (val: FT): void => {
			const old = untrack(getValue);
			if (old !== val) {
				parent.#value[1](
					produce(draft => {
						// biome-ignore lint/suspicious/noExplicitAny: any
						let target = draft as any;
						for (let i = 0; i < path.length - 1; i++) {
							target[path[i]] ??= {};
							target = target[path[i]];
						}
						target[path[path.length - 1]] = val;
					}),
				);

				if (parent.#validOnChange && parent.#validator) {
					parent.#validator.valid(unwrap(parent.getValue()), name).then(rslt => {
						setError(rslt[1] ? rslt[1][0].reason : undefined);
					});
				}
			}

			parent.#checkPreset();
		};

		const a = {
			name(): string {
				return name as string;
			},

			getError(): string | undefined {
				return parent.getError(name);
			},

			setError(err?: string): void {
				setError(err);
			},

			getValue(): FT {
				return getValue();
			},

			setValue(val: FT): void {
				setValue(val);
			},

			reset() {
				setError();
				setValue(parent.#preset[name] as FT);
			},
		};

		return a;
	}

	/**
	 * 指示是否处于交互状态
	 *
	 * @remarks
	 * 在 {@link load} 和 {@link submit} 的调用过程中，会返回 true。
	 */
	spinning() {
		return this.#spinning[0]();
	}

	/**
	 * 加载数据
	 *
	 * @returns 是否正确加载了数据，如果未指定 {@link Options#load}，则始终返回 false。
	 * @remarks
	 * 只有在正确加载数据的情况下，才会更换当前表单中的数据。否则保持原有数据不变。
	 * 加载的数据不会调用验证器对数据进行验证。
	 */
	async load(): Promise<boolean> {
		if (!this.#load) {
			return false;
		}

		this.#spinning[1](true);

		try {
			const ret = await this.#load();
			if (ret.ok) {
				if (ret.body) {
					this.setValue(ret.body);
					this.setPreset(ret.body);
				}
			} else {
				if (this.#onProblem) {
					if (!ret.body) {
						throw new Error('后端未返回正确的 Problem 对象');
					}
					await this.#onProblem(ret.body);
				}
			}

			return ret.ok;
		} finally {
			this.#spinning[1](false);
		}
	}

	/**
	 * 提交数据
	 *
	 * @returns 表示接口是否成功调用，如果当前表单未在构造函数中指定 {@link Options#submit} 参数，则始终返回 false。
	 */
	async submit(): Promise<boolean> {
		if (!this.#submit) {
			return false;
		}

		this.setError(); // 取消上次的错误提示

		this.#spinning[1](true);
		try {
			const obj = await this.validValue();
			if (!obj) {
				return false;
			}

			const ret = await this.#submit(obj);
			if (ret.ok) {
				if (this.#onSuccess) {
					this.#onSuccess(ret);
				}
				return true;
			}

			if (!ret.body) {
				throw new Error('后端未返回正确的 Problem 对象');
			}

			if (ret.status === 400) {
				if (ret.body.params) {
					this.setError(ret.body.params as Params<FlattenKeys<T>>);
				} else {
					this.setError(ret.body.title);
				}

				return false;
			}

			if (this.#onProblem) {
				await this.#onProblem(ret.body);
			}

			return false;
		} finally {
			this.#spinning[1](false);
		}
	}
}
