// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { ChangeFunc, Menu } from '@cmfx/components';
import type { Hotkey, Locale } from '@cmfx/core';
import type { RouteDefinition } from '@solidjs/router';
import { createUniqueId, type JSX } from 'solid-js';

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

interface ItemBase {
	/**
	 * 图标名称
	 */
	icon?: JSX.Element;

	/**
	 * 菜单的标题的翻译 ID
	 */
	label: string;

	suffix?: JSX.Element;
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
	| ({
			type: 'items';

			/**
			 * 子菜单
			 */
			items: Array<MenuItem>;
	  } & ItemBase)
	| ({
			type: 'a';

			/**
			 * 路由的跳转路径
			 */
			path: string;

			/**
			 * 快捷键
			 */
			hotkey?: Hotkey;
	  } & ItemBase)
	| ({
			type: 'button';

			/**
			 * 路由的跳转路径
			 */
			onclick: () => void;

			/**
			 * 快捷键
			 */
			hotkey?: Hotkey;
	  } & ItemBase);

type ButtonClickMap = Map<string, () => void>;

function buildButtonClick2MenuChange(clicks: ButtonClickMap): ChangeFunc<string | undefined> | undefined {
	if (clicks.size > 0) {
		return v => (v ? clicks.get(v)?.() : undefined);
	}
}

/**
 * 将配置项的菜单项生成符合 {@link Menu} 组件的菜单项
 * @param l - 翻译接口；
 * @param menus - 配置项中的菜单项；
 * @param clicks - 如果菜单项是 button 类型的，需要将点击事件存放在此处；
 * @returns
 */
export function buildItems(
	l: Locale,
	menus: Array<MenuItem>,
): [Array<Menu.Item>, ChangeFunc<string | undefined> | undefined] {
	const clicks: ButtonClickMap = new Map();
	const items = buildItemsWithClicks(l, menus, clicks);
	const change = buildButtonClick2MenuChange(clicks);
	return [items, change];
}

function buildItemsWithClicks(
	l: Locale,
	menus: Array<MenuItem>,
	clicks: Map<string, HTMLButtonElement['onclick']>,
): Array<Menu.Item> {
	const items: Array<Menu.Item> = [];

	menus.forEach(mi => {
		switch (mi.type) {
			case 'divider':
				items.push({ type: 'divider' });
				break;
			case 'group':
				items.push({
					type: 'group',
					label: l.t(mi.label),
					items: buildItemsWithClicks(l, mi.items, clicks),
				});
				break;
			case 'items':
				items.push({
					type: 'items',
					prefix: mi.icon,
					label: l.t(mi.label),
					suffix: mi.suffix,
					items: buildItemsWithClicks(l, mi.items, clicks),
				});
				break;
			case 'a':
				items.push({
					type: 'a',
					prefix: mi.icon,
					label: l.t(mi.label),
					suffix: mi.suffix,
					value: mi.path,
					hotkey: mi.hotkey,
				});
				break;
			case 'button': {
				const id = createUniqueId();
				clicks.set(id, mi.onclick);
				items.push({
					type: 'item',
					prefix: mi.icon,
					label: l.t(mi.label),
					suffix: mi.suffix,
					value: id,
					hotkey: mi.hotkey,
				});
				break;
			}
		}
	});

	return items;
}
