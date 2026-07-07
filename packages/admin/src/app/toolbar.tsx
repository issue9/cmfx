// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Menu } from '@cmfx/components';
import { Button, Dropdown, Search, ToggleButton, useAPI, useLocale, useOptions } from '@cmfx/components';
import type { Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';
import IconClear from '~icons/material-symbols/delete-rounded';
import IconLock from '~icons/material-symbols/lock';

import { useLockScreen } from './app';
import { useAdmin, useOptions as useAdminOptions } from './context';
import { buildItems } from './options';
import styles from './style.module.css';

/**
 * 创建一个全屏按钮
 *
 * @param hk - 快捷键；
 */
export function createFullscreen(hk?: Hotkey): Component {
	return () => {
		return <ToggleButton.FullScreen hotkey={hk} type="button" kind="flat" />;
	};
}

/**
 * 创建一个清除缓存的菜单
 *
 * @param hk - 快捷键；
 */
export function createClear(hk?: Hotkey): Component {
	return () => {
		const l = useLocale();
		const [api] = useAPI();
		const usr = useAdmin();
		const opt = useAdminOptions();
		const nav = useNavigate();
		const [set] = useOptions();

		return (
			<Dropdown
				selectedClass=""
				hotkey={hk}
				trigger="hover"
				items={[
					{ type: 'item', value: 'clear-api-cache', label: l.t('_p.toolbar.clearAPICache') },
					{ type: 'item', value: 'clear-storage', label: l.t('_p.toolbar.clearStorage') },
					{ type: 'divider' },
					{ type: 'item', value: 'clear-all', label: l.t('_p.toolbar.clearAllCache') },
				]}
				onChange={async val => {
					switch (val) {
						case 'clear-all':
							await api.clearCache();
							await usr.logout();
							set.clearStorage();
							nav(opt.routes.public.home);
							break;
						case 'clear-api-cache':
							await api.clearCache();
							break;
						case 'clear-storage':
							await usr.logout(); // 清除存储在 storage 中的登录信息
							set.clearStorage();
							nav(opt.routes.public.home);
							break;
					}
				}}
			>
				<Button kind="flat" square title={l.t('_p.toolbar.clearCache')}>
					<IconClear />
				</Button>
			</Dropdown>
		);
	};
}

/**
 * 创建一个搜索框
 *
 * @param hk - 工具栏；
 */
export function createSearch(hk?: Hotkey): Component {
	const search = async (value: string, menus: Array<Menu.Item>): Promise<Array<Menu.Item>> => {
		const items: Array<Menu.Item> = [];

		for (const m of menus) {
			if (m.type === 'items') {
				items.push(...(await search(value, m.items)));
			} else if (
				(m.type === 'a' || m.type === 'item') &&
				(m.label as string).toLowerCase().includes(value.toLowerCase()) // 由 Options 生成的菜单，label 必然是字符串
			) {
				items.push({ type: m.type, value: m.value, label: m.label });
			} else if (m.type === 'group' && m.items && m.items.length > 0) {
				items.push(...(await search(value, m.items)));
			}
		}

		return items;
	};

	return () => {
		const opt = useAdminOptions();
		const l = useLocale();

		const [items, change] = buildItems(l, [...opt.menus, ...opt.userMenus]);
		return <Search class={styles.search} icon clear hotkey={hk} onSearch={v => search(v, items)} onSelect={change} />;
	};
}

/**
 * 创建一个锁屏的按钮
 *
 * @param hk - 快捷键；
 */
export function createLockScreen(hk?: Hotkey): Component {
	return () => {
		const ls = useLockScreen();
		const l = useLocale();
		return (
			<Button
				type="button"
				square
				kind="flat"
				onclick={() => ls?.lock()}
				title={l.t('_p.toolbar.lockScreen')}
				hotkey={hk}
			>
				<IconLock />
			</Button>
		);
	};
}
