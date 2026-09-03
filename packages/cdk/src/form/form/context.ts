// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flatten, Flattenable, FlattenKeys, Params, Problem, Validator } from '@cmfx/core';
import { flatten, LogicError } from '@cmfx/core';
import equal from 'fast-deep-equal';
import { createSignal, createUniqueId, type JSX, untrack } from 'solid-js';
import { createStore, produce, reconcile, type SetStoreFunction, type Store, unwrap } from 'solid-js/store';

import type { ChangeFunc } from '@cdk/base';
import type { FormAttrs, FormContextOptions, FormField, FormState } from '@cdk/form/types';

// 用于在 FormContext 中保存错误数据的类型
type Err<T extends Flattenable> = Record<FlattenKeys<T>, string | undefined>;

type StoreX<T extends Flattenable> = [get: Store<T>, set: SetStoreFunction<T>];

/**
 * 用于操作表单的 API
 *
 * @typeParam A - 附带的额外属性对象；
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam P - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export class FormContext<A extends FormAttrs = FormAttrs, T extends Flattenable = Flattenable, R = unknown, P = never> {
	readonly #onProblem?: FormContextOptions<T, R, P>['onProblem'];
	readonly #load?: FormContextOptions<T, R, P>['load'];
	readonly #submit?: FormContextOptions<T, R, P>['submit'];
	readonly #onSuccess?: FormContextOptions<T, R, P>['onSuccess'];
	readonly #state = createSignal<FormState>('enabled');

	#preset: T; // 保存当前数据的默认值，用于在表单重置时恢复默认值
	#flattenedPreset: Flatten<T>;
	readonly #isPreset = createSignal(true);
	readonly #value: StoreX<T>;
	readonly #filedChanges: Map<FlattenKeys<T>, Array<ChangeFunc<unknown>>> = new Map();
	readonly #changes: Array<ChangeFunc<T>> = [];
	readonly #fields: Map<FlattenKeys<T>, FormField<Flatten<T>[FlattenKeys<T>]>> = new Map();

	readonly #errs = createStore<Err<T>>({} as Err<T>); // 各个字段的错误信息存取
	readonly #globalErr = createSignal<string>(); // 全局错误信息

	readonly #validator?: Validator<T>;
	readonly #validOnChange?: boolean;

	readonly #attrs = createStore<A>({} as A);

	/**
	 * 构造函数
	 */
	constructor(options: FormContextOptions<T, R, P>) {
		this.#load = options.load;
		this.#onProblem = options.onProblem;
		this.#submit = options.submit;
		this.#onSuccess = options.onSuccess;

		// NOTE: 如果 options.initValue 是一个 createStore 创建的对象，无法复制其中的值作为默认值。
		this.#preset = options.initValue;
		this.#flattenedPreset = flatten(options.initValue);
		this.#value = createStore<T>(structuredClone(options.initValue)); // 复制对象，防止与默认对象冲突。

		this.#validator = options.validator;
		this.#validOnChange = options.validOnChange;
	}

	setAttr(name: keyof A, val: A[keyof A]): void {
		// biome-ignore lint/suspicious/noExplicitAny: any
		this.#attrs[1](name as any, val as any);
	}

	setAttrs(v: A): void {
		this.#attrs[1](v);
	}

	getAttrs() {
		return this.#attrs[0];
	}

	/**
	 * 指定默认值
	 */
	setPreset(v: T) {
		this.#preset = v;
		this.#flattenedPreset = flatten(v);
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
	 * 检测 #value 中的值是否与默认值一致
	 */
	#checkPreset() {
		const vals = unwrap(this.#value[0]);
		this.#isPreset[1](equal(vals, this.#preset));
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
		this.setError(rslt[1] as Params<FlattenKeys<T>>); // rslt[1] 必然是 Params<FlattenKeys<T>
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
	 *
	 *
	 * @param val 新的值；
	 * @param silent 如果为 true，不触发 {@link onChange} 注册的事件；
	 * @remarks
	 * 修改之后会调用 {@link #validator} 进行验证。
	 */
	setValue(obj: T, silent?: boolean) {
		if (this.getState() === 'readonly') {
			return;
		}

		const old = unwrap(this.#value[0]);
		const copy = structuredClone(obj);
		this.#value[1](reconcile(copy));

		// 验证
		if (this.#validator) {
			this.#validator.valid(copy).then(rslt => {
				this.setError(rslt[1] as Params<FlattenKeys<T>>);
			});
		}

		if (!silent) {
			// field onchange
			this.#filedChanges.entries().forEach(v => {
				const o = getFieldValue(old, v[0].split('.')); // 旧值
				const n = getFieldValue(this.#value[0], v[0].split('.')); // 新值

				for (const f of v[1]) {
					f(n, o);
				}
			});

			// onchange
			for (const f of this.#changes) {
				f(this.#value[0], old);
			}
		}

		this.#checkPreset();
	}

	/**
	 * 注册全局对象改变的回调事件
	 */
	onChange(f: ChangeFunc<T>) {
		this.#changes.push(f);
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
	 * 返回指定字段名称的错误
	 *
	 * @param k - 字段名称，如果为空表示要返回整个接口全局性的错误；
	 */
	getError(k?: FlattenKeys<T>): string | undefined {
		return k ? this.#errs[0][k] : this.#globalErr[0]();
	}

	/**
	 * 重置所有字段的状态和值
	 *
	 * @param silent 如果为 true，不触发 {@link onChange} 注册的事件；
	 */
	reset(silent?: boolean) {
		this.setError();
		this.setValue(this.#preset, silent);
	}

	/**
	 * 创建对当前对象中某个字段的存取接口
	 *
	 * @param name - 字段名；
	 * @param id - 如果指定了该参数，则使用该值作为 {@link FormField#id} 的值，否则会自动生成一个唯一的 id 值；
	 */
	createField<FT = Flatten<T>[FlattenKeys<T>]>(name: FlattenKeys<T>, id?: string): FormField<FT> {
		const parent = this;

		if (parent.#fields.has(name)) {
			return parent.#fields.get(name) as FormField<FT>;
		}

		const path = name.split('.');

		const setError = (err?: string): void => {
			parent.setError(err ? [{ name, reason: err }] : undefined);
		};

		const [extra, setExtra] = createSignal<JSX.Element | undefined>(undefined);

		const state = createSignal<FormState>(parent.getState());

		const getValue = (): FT | undefined => getFieldValue(parent.#value[0], path);

		const setValue = (val: FT, silent?: boolean): void => {
			if (state[0]() === 'readonly' || parent.getState() !== 'enabled') {
				return;
			}

			const old = untrack(getValue);
			if (!equal(old, val)) {
				const oldObj = unwrap(parent.#value[0]);

				setFieldValue(parent.#value[1], path, val);

				// 验证数据
				if (parent.#validOnChange && parent.#validator) {
					// biome-ignore lint/suspicious/noExplicitAny: any
					parent.#validator.valid(unwrap(parent.getValue()), name as any).then(rslt => {
						setError(rslt[1] ? rslt[1][0].reason : undefined);
					});
				}

				if (!silent) {
					// 触发 field change 回调
					const list = parent.#filedChanges.get(name);
					if (list) {
						for (const f of list) {
							f(val, old);
						}
					}

					// onchange
					for (const f of parent.#changes) {
						f(parent.#value[0], oldObj);
					}
				}
			}

			parent.#checkPreset();
		};

		const field = {
			id: id ?? createUniqueId(),
			name: name,
			inForm: true,

			getState(): FormState {
				return state[0]();
			},

			setState(s: FormState): void {
				state[1](s);
			},

			getError(): string | undefined {
				return parent.getError(name);
			},

			setError(err?: string): void {
				setError(err);
			},

			getValue(): FT | undefined {
				return getValue();
			},

			setValue(val: FT, silent?: boolean): void {
				setValue(val, silent);
			},

			onChange(f: ChangeFunc<FT>): void {
				const list = parent.#filedChanges.get(name);
				if (list) {
					list.push(f as ChangeFunc<unknown>);
				} else {
					parent.#filedChanges.set(name, [f as ChangeFunc<unknown>]);
				}
			},

			reset(silent?: boolean) {
				setError();
				setValue(parent.#flattenedPreset[name] as FT, silent);
			},

			getExtra: extra,
			setExtra: setExtra,
		} satisfies FormField<FT>;

		// 需要緩存，否则多次调用会导致 id 值不同。
		parent.#fields.set(name, field as FormField<Flatten<T>[FlattenKeys<T>]>);

		return field;
	}

	/**
	 * 指示当前的状态
	 */
	getState() {
		return this.#state[0]();
	}

	/**
	 * 设置表单状态
	 */
	setState(v: FormState): void {
		this.#state[1](v);
	}

	/**
	 * 加载数据
	 *
	 * @returns 是否正确加载了数据，如果未指定 {@link FormContextOptions#load}，则始终返回 false。
	 * @remarks
	 * 只有在正确加载数据的情况下，才会更换当前表单中的数据。否则保持原有数据不变。
	 * 加载的数据不会调用验证器对数据进行验证。
	 */
	async load(): Promise<boolean> {
		if (!this.#load) {
			return false;
		}

		this.setState('loading');

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
						throw new LogicError('后端未返回正确的 Problem 对象');
					}
					await this.#onProblem(ret.body);
				}
			}

			return !!ret.ok;
		} finally {
			this.setState('enabled');
		}
	}

	/**
	 * 提交数据
	 *
	 * @returns 表示接口是否成功调用，如果当前表单未在构造函数中指定 {@link FormContextOptions#submit} 参数，则始终返回 false。
	 */
	async submit(): Promise<boolean> {
		if (!this.#submit) {
			return false;
		}

		this.setError(); // 取消上次的错误提示

		this.setState('submitting');
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
				throw new LogicError('后端未返回正确的 Problem 对象');
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
			this.setState('enabled');
		}
	}
}

export function getFieldValue<T extends Flattenable, FT = Flatten<T>[FlattenKeys<T>]>(
	obj: T,
	path: Array<string>,
): FT | undefined {
	const v =
		path.length === 1
			? obj[path[0]]
			: path.reduce((acc, key) => {
					return (key && acc ? acc[key] : acc) as T;
				}, obj);
	return v as FT | undefined;
}

export function setFieldValue<T extends Flattenable, FT = Flatten<T>[FlattenKeys<T>]>(
	obj: SetStoreFunction<T>,
	path: Array<string>,
	val: FT,
): void {
	obj(
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
}
