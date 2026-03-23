// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTable from '~icons/lets-icons/table';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Loader } from './loader';
import { default as loader } from './loader.tsx?raw';
import { default as Paging } from './paging';
import { default as paging } from './paging.tsx?raw';
import { default as Table } from './table';
import { default as table } from './table.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.table',
		icon: IconTable,
		path: 'table',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{
				component: Basic,
				source: basic,
				layout: 'vertical',
				title: '数据表格',
				desc: '用于展示数据，但是不支持分页。',
			},
			{
				component: Table,
				source: table,
				layout: 'vertical',
				title: '表格',
				desc: '基本的表格功能，与 HTML 的 table 相同，加上了部分控制功能。',
			},
			{
				component: Loader,
				source: loader,
				layout: 'vertical',
				title: '动态加载',
				desc: '用于展示数据，可通过方法加载数据内容，支持分页。',
			},
			{
				component: Paging,
				source: paging,
				layout: 'vertical',
				title: '分页',
				desc: '用于展示数据，可通过方法加载数据内容，支持分页。',
			},
		],
	};
}
