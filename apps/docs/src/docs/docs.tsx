// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
	Drawer,
	DrawerRef,
	joinClass,
	Menu,
	MenuItem,
	MenuItemGroup,
	MenuRef,
	Nav,
	NavRef,
	Page,
	useLocale,
	useOptions,
} from '@cmfx/components';
import { ArrayElement, Locale } from '@cmfx/core';
import { Source } from '@cmfx/vite-plugin-api';
import { RouteDefinition, useCurrentMatches } from '@solidjs/router';
import { createEffect, createSignal, JSX, onCleanup, onMount, ParentProps, Setter } from 'solid-js';

import { floatingWidth, MarkdownFileObject, markdown } from '@docs/utils';
import { default as advanceAPI } from './advance/api.zh-Hans.json' with { type: 'json' };
import styles from './style.module.css';
import { default as usageAPI } from './usage/api.zh-Hans.json' with { type: 'json' };

type Kind = 'intro' | 'usage' | 'advance';

// 定义了所有文章的路由
//
// title: 在翻译文件中对应的翻译项 id；
// kind 表示文章类型，用于区分不同类型的文档；
const routes: Array<RouteDefinition & { kind: Kind }> = [
	{
		kind: 'intro',
		path: ['/', '/intro/readme'],
		info: { title: '_d.docs.intro' },
		component: () => (
			<Markdown
				articles={import.meta.glob('../../../../README.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'intro',
		path: '/intro/changelog',
		info: { title: '_d.docs.changelog' },
		component: () => (
			<Markdown
				articles={import.meta.glob('../../../../CHANGELOG.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},

	//////////////////// usage

	{
		kind: 'usage',
		path: '/usage/install',
		info: { title: '_d.docs.install' },
		component: () => (
			<Markdown
				types={usageAPI as Array<Source>}
				articles={import.meta.glob('./usage/install.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/platform',
		info: { title: '_d.docs.platform' },
		component: () => (
			<Markdown
				types={usageAPI as Array<Source>}
				articles={import.meta.glob('./usage/platform.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/svg',
		info: { title: '_d.docs.svg' },
		component: () => (
			<Markdown
				types={usageAPI as Array<Source>}
				articles={import.meta.glob('./usage/svg.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/theme',
		info: { title: '_d.docs.theme' },
		component: () => (
			<Markdown
				types={usageAPI as Array<Source>}
				articles={import.meta.glob('./usage/theme.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/faq',
		info: { title: '_d.docs.faq' },
		component: () => (
			<Markdown
				types={usageAPI as Array<Source>}
				articles={import.meta.glob('./usage/faq.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},

	//////////////////// advance

	{
		kind: 'advance',
		path: '/advance/locale',
		info: { title: '_d.docs.locale' },
		component: () => (
			<Markdown
				types={advanceAPI as Array<Source>}
				articles={import.meta.glob('./advance/locale.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/validator',
		info: { title: '_d.docs.validator' },
		component: () => (
			<Markdown
				types={advanceAPI as Array<Source>}
				articles={import.meta.glob('./advance/validator.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/error',
		info: { title: '_d.docs.error' },
		component: () => (
			<Markdown
				types={advanceAPI as Array<Source>}
				articles={import.meta.glob('./advance/error.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/custom-theme',
		info: { title: '_d.docs.customTheme' },
		component: () => (
			<Markdown
				types={advanceAPI as Array<Source>}
				articles={import.meta.glob('./advance/custom-theme.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/plugins',
		info: { title: '_d.docs.plugins' },
		component: () => (
			<Markdown
				types={advanceAPI as Array<Source>}
				articles={import.meta.glob('./advance/plugins.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
] as const;

// 生成 Drawer 组件的侧边栏菜单
export function buildMenus(l: Locale, prefix: string): Array<MenuItem<string>> {
	const menus: Array<MenuItemGroup<string>> = [
		{ type: 'group', label: l.t('_d.docs.intro'), items: [] },
		{ type: 'group', label: l.t('_d.docs.usage'), items: [] },
		{ type: 'group', label: l.t('_d.docs.advance'), items: [] },
	];

	const append = (group: MenuItemGroup<string>, r: ArrayElement<typeof routes>) => {
		const p = Array.isArray(r.path) ? r.path[0] : r.path;
		group.items.push({ type: 'a', label: l.t(r.info?.title), value: prefix + p });
	};

	routes.forEach(r => {
		switch (r.kind) {
			case 'intro':
				append(menus[0], r);
				break;
			case 'usage':
				append(menus[1], r);
				break;
			case 'advance':
				append(menus[2], r);
				break;
		}
	});

	return menus;
}

interface MarkdownProps {
	articles: MarkdownFileObject;
	types?: Array<Source>;
}

// 加载 Markdown 文档
//
// article 对应的是 maps 中的文章 ID；
function Markdown(props: MarkdownProps): JSX.Element {
	const l = useLocale();
	const [, origin] = useOptions();

	const route = useCurrentMatches()();
	const title = route[route.length - 1].route.info?.title;

	const articleObjs = Object.entries(props.articles).map(([k, v]) => [
		k.replace(/\.md$/, '').replace(/^\.\/(usage|advance)\/[^.]*\./, ''),
		v,
	]);
	const articles = Object.fromEntries(articleObjs);
	const keys = Object.keys(articles);

	let articleRef!: HTMLElement;
	let navRef: NavRef;

	const [html, setHTML] = createSignal<string>(
		articleObjs.length > 1
			? markdown(articles[l.match(keys, origin.locale)], props.types)
			: markdown(articleObjs[0][1], props.types),
	);

	if (articleObjs.length > 1) {
		createEffect(() => {
			const data = articles[l.match(keys, origin.locale)];
			if (data) {
				setHTML(markdown(data, props.types));
				navRef.refresh();
			}
		});
	}

	return (
		<Page title={title} class={styles.docs}>
			<article
				ref={el => {
					articleRef = el;
				}}
				class={styles.doc}
				innerHTML={html()}
			/>
			<Nav
				minHeaderCount={5}
				class={styles.nav}
				ref={el => {
					navRef = el;
				}}
				target={articleRef}
				query="h2,h3,h4,h5,h6"
			/>
		</Page>
	);
}

/**
 * 提供了文档浏览的路由定义
 */
export function buildRoute(prefix: string, setDrawer: Setter<DrawerRef | undefined>): RouteDefinition {
	return {
		path: prefix,
		component: (props: ParentProps) => {
			const l = useLocale();
			let menuRef: MenuRef;

			let ref: DrawerRef;
			onMount(() => {
				setDrawer(ref);
				menuRef.scrollSelectedIntoView();
			});
			onCleanup(() => setDrawer(undefined));

			return (
				<Drawer
					visible
					floating={floatingWidth}
					ref={el => {
						ref = el;
					}}
					palette="secondary"
					mainClass={joinClass('surface')}
					main={props.children}
				>
					<Menu
						ref={el => {
							menuRef = el;
						}}
						class="min-w-60"
						layout="inline"
						items={buildMenus(l, prefix)}
					/>
				</Drawer>
			);
		},
		children: routes,
	};
}
