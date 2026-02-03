// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import './style.css';

import {
	admins,
	create,
	createClear,
	createFullscreen,
	createSearch,
	current,
	members,
	Options,
	roles,
	system,
} from '@cmfx/admin';
import { Card, createChartLocaleLoader, Label, Scheme, schemes, useLocale } from '@cmfx/components';
import { createZodLocaleLoader, Hotkey } from '@cmfx/core';
import IconSettings from '~icons/material-symbols/admin-panel-settings';
import IconDashboard from '~icons/material-symbols/dashboard';
import IconHost from '~icons/material-symbols/host';
import IconAccount from '~icons/material-symbols/supervisor-account';

import { default as Test } from './pages/test';

const urlBase = 'http://localhost:8080/admin';

const rolesPage = roles.build('/roles');
const adminsPage = admins.build('/admins');
const systemPage = system.build('/system', () => {
	const l = useLocale();
	return <p>关于页面的内容，可以使用任意的 `use*` 方法。{l.t('_p.system.system')}</p>;
});
const membersPage = members.build('/members');
const currentPage = current.build('/current', () => {
	return (
		<>
			<current.MemberStatisticPanel />
			<div class="flex gap-4">
				<Card class="basis-1/2">1/2</Card>
				<Card class="basis-1/2">1/2</Card>
			</div>
			<div class="flex gap-4">
				<Card class="basis-1/3" header={<Label icon={<IconDashboard />}>dashboard</Label>}>
					1/3
				</Card>
				<div class="basis-2/3 flex flex-col gap-4">
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
	{ type: 'item', icon: <IconDashboard />, label: '_p.current.dashboard', path: '/current/dashboard' },
	{ type: 'item', label: 'nest.abc', path: '/test/5/test' },
	{
		type: 'group',
		label: 'system',
		items: [
			{
				type: 'item',
				label: 'administrator',
				icon: <IconSettings />,
				items: [...rolesPage.menus(), ...adminsPage.menus()],
			},
			{
				type: 'item',
				label: '_p.system.system',
				icon: <IconHost />,
				items: [...systemPage.menus()],
			},
			{
				type: 'item',
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

	systemDialog: true,
	systemNotify: true,

	mode: 'system',
	scheme: 'green',
	schemes: new Map<string, Scheme>([
		['green', schemes.green],
		['purple', schemes.purple],
	]),

	messages: {
		en: [
			async () => {
				return (await import('@cmfx/components/messages/en.lang.js')).default;
			},
			async () => {
				return (await import('@cmfx/admin/messages/en.lang.js')).default;
			},
			async () => {
				return (await import('./locales/en')).default;
			},
			createChartLocaleLoader((await import('../node_modules/echarts/lib/i18n/langEN.js')).default),
			createZodLocaleLoader((await import('../node_modules/zod/v4/locales/en.js')).default),
		],
		'zh-Hans': [
			async () => {
				return (await import('@cmfx/components/messages/zh-Hans.lang.js')).default;
			},
			async () => {
				return (await import('@cmfx/admin/messages/zh-Hans.lang.js')).default;
			},
			async () => {
				return (await import('./locales/zh-Hans')).default;
			},
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
	toolbar: [createSearch(new Hotkey('k', 'control')), createClear(), createFullscreen()],
};

create('app', o);
