// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { VoidComponent } from 'solid-js';
import IconServices from '~icons/eos-icons/service-plan';
import IconHelp from '~icons/material-symbols/help';
import IconInfo from '~icons/material-symbols/page-info';
import IconRoutes from '~icons/material-symbols/route';

import { Pages } from '@admin/pages/pages';
import { About } from './about';
import { Info } from './info';
import { Routes } from './routes';
import { Services } from './services';

/**
 * 提供系统相关的功能
 */
export class system implements Pages {
	/**
	 * 路由数据页面
	 */
	static Routes = Routes;

	/**
	 * 系统服务页面
	 */
	static Services = Services;

	/**
	 * 关于页面
	 */
	static About = About;

	/**
	 * 系统信息
	 */
	static Info = Info;

	readonly #prefix: string;
	readonly #about?: VoidComponent;

	/**
	 * 构建 {@link system} 对象
	 *
	 * @param prefix - 路由地址前缀；
	 * @param about - 关于页面的附加内容，如果是 undefined 表示不显示关于页面；
	 */
	static build(prefix: string, about?: VoidComponent) {
		return new system(prefix, about);
	}

	private constructor(p: string, about?: VoidComponent) {
		this.#prefix = p;
		this.#about = about;
	}

	routes(): ReturnType<Pages['routes']> {
		const routes = [
			{ path: `${this.#prefix}/routes`, component: Routes },
			{ path: `${this.#prefix}/services`, component: Services },
			{ path: `${this.#prefix}/info`, component: Info },
		];
		if (this.#about) {
			routes.push({ path: `${this.#prefix}/about`, component: () => About({ description: this.#about }) });
		}

		return routes;
	}

	menus(): ReturnType<Pages['menus']> {
		const menus: ReturnType<Pages['menus']> = [
			{ type: 'item', icon: <IconRoutes />, label: '_p.system.routes', path: `${this.#prefix}/routes` },
			{ type: 'item', icon: <IconServices />, label: '_p.system.services', path: `${this.#prefix}/services` },
			{ type: 'item', icon: <IconHelp />, label: '_p.system.serverInfo', path: `${this.#prefix}/info` },
		];
		if (this.#about) {
			menus.push({ type: 'item', icon: <IconInfo />, label: '_p.system.about', path: `${this.#prefix}/about` });
		}

		return menus;
	}
}
