// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import './style.css';

import type { Options } from '@cmfx/admin';
import {
	admins,
	create,
	createClear,
	createFullscreen,
	createLockScreen,
	createSearch,
	current,
	members,
	roles,
	system,
} from '@cmfx/admin';
import { Card, createChartLocaleLoader, Label } from '@cmfx/components';
import { createZodLocaleLoader, Hotkey } from '@cmfx/core';
import { type Scheme, schemes } from '@cmfx/themes';
import YAML from 'yaml';
import IconSettings from '~icons/material-symbols/admin-panel-settings';
import IconDashboard from '~icons/material-symbols/dashboard';
import IconHost from '~icons/material-symbols/host';
import IconAccount from '~icons/material-symbols/supervisor-account';

import pkg from '../../../package.json' with { type: 'json' };
import { default as webYaml } from '../../server/web.yaml?raw';
import { default as Test } from './pages/test';

const y = YAML.parse(webYaml);
const urlBase = y.http.url + y.user.admin.user.urlPrefix;

current.initPassports();

const rolesPage = roles.build('/roles');
const adminsPage = admins.build('/admins');
const systemPage = system.build('/system', {
	info: {
		name: pkg.name,
		version: pkg.version,
		lastUpdate: new Date().toISOString(),
		license: pkg.license,
		homepage: pkg.homepage,
		author: {
			name: pkg.author.name,
			url: pkg.author.url,
			email: 'abc@example.com',
		},
	},
	description: () => pkg.description,
});
const membersPage = members.build('/members');
const currentPage = current.build('/current', () => {
	return (
		<>
			<current.Statistic />
			<div class="flex gap-4">
				<Card class="basis-1/2">1/2</Card>
				<Card class="basis-1/2">1/2</Card>
			</div>
			<div class="flex gap-4">
				<Card class="basis-1/3" header={<Label icon={<IconDashboard />}>dashboard</Label>}>
					1/3
				</Card>
				<div class="flex basis-2/3 flex-col gap-4">
					<Card header={<Label icon={<IconDashboard />}>dashboard</Label>}>line 1</Card>
					<Card>line 2</Card>
				</div>
			</div>
		</>
	);
});

const routes: Options['routes'] = {
	public: {
		home: '/login',
		routes: [
			{
				path: '/login',
				component: () => (
					<current.Login
						footer={[
							{ title: '&copy; 2024-2025 by Example .Inc', link: 'https://example.com' },
							{ title: 'text' },
							{ title: 'repo', link: 'https://github.com/issue/cmfx' },
						]}
					/>
				),
			},
		],
	},
	private: {
		home: '/current/dashboard',
		routes: [
			{ path: ['/dashboard', '/'], component: current.Dashboard },
			{ path: '/test/:id/test', component: Test },
			...rolesPage.routes(),
			...adminsPage.routes(),
			...systemPage.routes(),
			...currentPage.routes(),
			...membersPage.routes(),
		],
	},
};

const menus: Options['menus'] = [
	{ type: 'a', icon: <IconDashboard />, label: '_p.current.dashboard', path: '/current/dashboard' },
	{ type: 'a', label: 'nest.abc', path: '/test/5/test' },
	{
		type: 'group',
		label: 'system',
		items: [
			{
				type: 'items',
				label: 'administrator',
				icon: <IconSettings />,
				items: [...rolesPage.menus(), ...adminsPage.menus()],
			},
			{
				type: 'items',
				label: '_p.system.system',
				icon: <IconHost />,
				items: [...systemPage.menus()],
			},
			{
				type: 'items',
				label: '_p.member.member',
				icon: <IconAccount />,
				items: [...membersPage.menus()],
			},
		],
	},
];

const o: Options = {
	id: 'admin-demo',
	layout: 'vertical',

	routes,

	mode: 'system',
	scheme: 'green',
	schemes: new Map<string, Scheme>([
		['green', schemes.green],
		['purple', schemes.purple],
	]),

	messages: {
		en: [
			async () => (await import('@cmfx/components/en.lang')).default,
			async () => (await import('@cmfx/admin/en.lang')).default,
			async () => (await import('@cmfx/illustrations/en.lang')).default,
			async () => (await import('./locales/en')).default,
			createChartLocaleLoader((await import('../node_modules/echarts/lib/i18n/langEN.js')).default),
			createZodLocaleLoader((await import('../node_modules/zod/v4/locales/en.js')).default),
		],
		'zh-Hans': [
			async () => (await import('@cmfx/components/zh-Hans.lang')).default,
			async () => (await import('@cmfx/admin/zh-Hans.lang')).default,
			async () => (await import('@cmfx/illustrations/zh-Hans.lang')).default,
			async () => (await import('./locales/zh-Hans')).default,
			createChartLocaleLoader((await import('../node_modules/echarts/lib/i18n/langZH.js')).default),
			createZodLocaleLoader((await import('../node_modules/zod/v4/locales/zh-CN.js')).default),
		],
	},
	locale: 'en',

	api: {
		base: urlBase,
		token: '/token',
		info: '/info',
		contentType: 'application/json',
		acceptType: 'application/json',
	},

	title: 'Title',
	logo: '/brand-static.svg',
	menus: menus,
	floatingMinWidth: '4xl',
	userMenus: currentPage.menus(),
	toolbar: [createSearch(new Hotkey('k', 'control')), createClear(), createFullscreen(), createLockScreen()],
};

create('app', o);
