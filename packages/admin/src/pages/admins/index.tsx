// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconAccount from '~icons/material-symbols/manage-accounts';

import { Pages } from '@admin/pages/pages';
import { Admins } from './admins';
import { Edit } from './edit';
import { New } from './new';

/**
 * 提供与管理员相关的页面以及相关组件
 */
export class admins implements Pages {
	/**
	 * 管理员列表页面
	 */
	static Admins = Admins;

	/**
	 * 编辑管理员信息页面
	 */
	static Edit = Edit;

	/**
	 * 新建管理员页面
	 */
	static New = New;

	readonly #prefix: string;

	private constructor(prefix: string) {
		this.#prefix = prefix;
	}

	/**
	 * 构建当前对象
	 */
	static build(prefix: string) {
		return new admins(prefix);
	}

	routes(): ReturnType<Pages['routes']> {
		return [
			{ path: this.#prefix, component: () => Admins({ routePrefix: this.#prefix }) },
			{ path: this.#prefix + '/0', component: () => New({ backURL: this.#prefix }) },
			{ path: this.#prefix + '/:id', component: () => Edit({ backURL: this.#prefix }) },
		];
	}

	menus(): ReturnType<Pages['menus']> {
		return [{ type: 'item', icon: <IconAccount />, label: '_p.admin.admin', path: this.#prefix }];
	}
}
