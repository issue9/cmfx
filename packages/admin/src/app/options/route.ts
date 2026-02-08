// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem as XMenuItem } from '@cmfx/components';
import { Hotkey, Locale } from '@cmfx/core';
import { RouteDefinition } from '@solidjs/router';
import { JSX } from 'solid-js';

/**
 * 对路由的定义
 *
 * public 和 private 中不能有相同的路由项，否则会导致无法正确导航。
 */
export interface Routes {
	/**
	 * 不需要登录即可查看的页面
	 */
	public: Group;

	/**
	 * 需要登录才可查看的页面
	 */
	private: Group;
}

interface Group {
	/**
	 * 默认页
	 */
	home: string;

	/**
	 * 该分组下的所有路由项
	 */
	routes: Array<RouteDefinition>;
}

export type MenuItem =
	| {
			type: 'divider';
	  }
	| {
			type: 'group';

			/**
			 * 翻译 ID
			 */
			label: string;

			/**
			 * 子菜单
			 */
			items: Array<MenuItem>;
	  }
	| {
			type: 'item';

			/**
			 * 图标名称
			 */
			icon?: JSX.Element;

			/**
			 * 菜单的标题的翻译 ID
			 */
			label: string;

			/**
			 * 路由的跳转路径，如果是分组项，此值为空。
			 */
			path?: string;

			/**
			 * 子菜单
			 */
			items?: Array<MenuItem>;

			/**
			 * 快捷键
			 */
			hotkey?: Hotkey;

			suffix?: JSX.Element;
	  };

export function buildItems(l: Locale, menus: Array<MenuItem>): Array<XMenuItem<string>> {
	const items: Array<XMenuItem<string>> = [];
	menus.forEach((mi) => {
		switch (mi.type) {
			case 'divider':
				items.push({ type: 'divider' });
				break;
			case 'group':
				items.push({
					type: 'group',
					label: l.t(mi.label),
					items: buildItems(l, mi.items),
				});
				break;
			case 'item':
				items.push({
					type: 'a',
					prefix: mi.icon,
					label: l.t(mi.label),
					value: mi.path,
					hotkey: mi.hotkey,
					items: mi.items ? buildItems(l, mi.items) : undefined,
					suffix: mi.suffix,
				});
				break;
		}
	});

	return items;
}
