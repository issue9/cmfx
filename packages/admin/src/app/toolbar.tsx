// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Menu } from '@cmfx/components';
import { Button, Dropdown, Search, ToggleButton, useLocale, useOptions } from '@cmfx/components';
import type { Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';
import IconClear from '~icons/material-symbols/delete-rounded';

import { useAdmin, useOptions as useAdminOptions, useAPI } from './context';
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
		const api = useAPI();
		const usr = useAdmin();
		const opt = useAdminOptions();
		const nav = useNavigate();
		const [set] = useOptions();

		return (
			<Dropdown.Root
				selectedClass=""
				hotkey={hk}
				trigger="hover"
				items={[
					{ type: 'item', value: 'clear-api-cache', label: l.t('_p.system.clearAPICache') },
					{ type: 'item', value: 'clear-storage', label: l.t('_p.system.clearStorage') },
					{ type: 'divider' },
					{ type: 'item', value: 'clear-all', label: l.t('_p.system.clearAllCache') },
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
				<Button.Root kind="flat" square title={l.t('_p.system.clearCache')}>
					<IconClear />
				</Button.Root>
			</Dropdown.Root>
		);
	};
}

/**
 * 创建一个搜索框
 *
 * @param hk - 工具栏；
 */
export function createSearch(hk?: Hotkey): Component {
	const search = async (value: string, menus: Array<Menu.MenuItem>): Promise<Array<Menu.Item>> => {
		const items: Array<Menu.Item> = [];

		for (const m of menus) {
			if (m.type === 'a' && m.items && m.items.length > 0) {
				items.push(...(await search(value, m.items)));
			} else if (m.type === 'a' && m.label && (m.label as string).toLowerCase().includes(value.toLowerCase())) {
				items.push({ type: 'a', value: m.value, label: m.label });
			} else if (m.type === 'group' && m.items && m.items.length > 0) {
				items.push(...(await search(value, m.items)));
			}
		}

		return items;
	};

	return () => {
		const opt = useAdminOptions();
		const l = useLocale();

		return (
			<Search.Root class={styles.search} icon clear hotkey={hk} onSearch={v => search(v, buildItems(l, opt.menus))} />
		);
	};
}
