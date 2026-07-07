// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { VoidComponent } from 'solid-js';
import IconServices from '~icons/eos-icons/service-plan';
import IconHelp from '~icons/material-symbols/help';
import IconInfo from '~icons/material-symbols/page-info';
import IconRoutes from '~icons/material-symbols/route';
import IconSettings from '~icons/material-symbols/settings';

import type { Pages } from '@admin/pages/pages';
import { About } from './about';
import { Info } from './info';
import { Routes } from './routes';
import { Services } from './services';
import { Settings } from './settings';

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

	/**
	 * 系统设置
	 */
	static Settings = Settings;

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
			{ path: `${this.#prefix}/settings`, component: Settings },
		];
		if (this.#about) {
			routes.push({ path: `${this.#prefix}/about`, component: () => About({ description: this.#about }) });
		}

		return routes;
	}

	menus(): ReturnType<Pages['menus']> {
		const menus: ReturnType<Pages['menus']> = [
			{ type: 'a', icon: <IconRoutes />, label: '_p.system.routes', path: `${this.#prefix}/routes` },
			{ type: 'a', icon: <IconServices />, label: '_p.system.services', path: `${this.#prefix}/services` },
			{ type: 'a', icon: <IconHelp />, label: '_p.system.serverInfo', path: `${this.#prefix}/info` },
			{ type: 'a', icon: <IconSettings />, label: '_p.system.settings.settings', path: `${this.#prefix}/settings` },
		];
		if (this.#about) {
			menus.push({ type: 'a', icon: <IconInfo />, label: '_p.system.about', path: `${this.#prefix}/about` });
		}

		return menus;
	}
}
