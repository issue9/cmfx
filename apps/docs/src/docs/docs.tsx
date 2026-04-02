// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Code, Drawer, joinClass, Markdown, Menu, Nav, Page, useLocale, useOptions } from '@cmfx/components';
import type { ArrayElement, Locale } from '@cmfx/core';
import type { Type } from '@cmfx/vite-plugin-api';
import { type RouteDefinition, useCurrentMatches } from '@solidjs/router';
import type { JSX, ParentProps, Setter } from 'solid-js';
import { createMemo, onCleanup, onMount } from 'solid-js';

import { APIDoc } from '@docs/apidoc';
import { type APIFileObject, fileObject2Map, floatingWidth, type TextFileObject } from '@docs/utils';
import styles from './style.module.css';

const kinds = ['intro', 'usage', 'advance'] as const;

type Kind = (typeof kinds)[number];

const usageAPI = import.meta.glob('./usage/api.*.json', { eager: true, import: 'default' }) as APIFileObject;
const advanceAPI = import.meta.glob('./advance/api.*.json', { eager: true, import: 'default' }) as APIFileObject;

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
			<Doc articles={import.meta.glob('../../../../README.md', { eager: true, query: '?raw', import: 'default' })} />
		),
	},
	{
		kind: 'intro',
		path: '/intro/changelog',
		info: { title: '_d.docs.changelog' },
		component: () => (
			<Doc articles={import.meta.glob('../../../../CHANGELOG.md', { eager: true, query: '?raw', import: 'default' })} />
		),
	},

	//////////////////// usage

	{
		kind: 'usage',
		path: '/usage/install',
		info: { title: '_d.docs.install' },
		component: () => (
			<Doc
				types={usageAPI}
				articles={import.meta.glob('./usage/install.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/platform',
		info: { title: '_d.docs.platform' },
		component: () => (
			<Doc
				types={usageAPI}
				articles={import.meta.glob('./usage/platform.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/svg',
		info: { title: '_d.docs.svg' },
		component: () => (
			<Doc
				types={usageAPI}
				articles={import.meta.glob('./usage/svg.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/theme',
		info: { title: '_d.docs.theme' },
		component: () => (
			<Doc
				types={usageAPI}
				articles={import.meta.glob('./usage/theme.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'usage',
		path: '/usage/faq',
		info: { title: '_d.docs.faq' },
		component: () => (
			<Doc
				types={usageAPI}
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
			<Doc
				types={advanceAPI}
				articles={import.meta.glob('./advance/locale.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/validator',
		info: { title: '_d.docs.validator' },
		component: () => (
			<Doc
				types={advanceAPI}
				articles={import.meta.glob('./advance/validator.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/error',
		info: { title: '_d.docs.error' },
		component: () => (
			<Doc
				types={advanceAPI}
				articles={import.meta.glob('./advance/error.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/custom-theme',
		info: { title: '_d.docs.customTheme' },
		component: () => (
			<Doc
				types={advanceAPI}
				articles={import.meta.glob('./advance/custom-theme.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
	{
		kind: 'advance',
		path: '/advance/plugins',
		info: { title: '_d.docs.plugins' },
		component: () => (
			<Doc
				types={advanceAPI}
				articles={import.meta.glob('./advance/plugins.*.md', { eager: true, query: '?raw', import: 'default' })}
			/>
		),
	},
] as const;

// 生成 Drawer 组件的侧边栏菜单
export function buildMenus(l: Locale, prefix: string): Array<Menu.MenuItem> {
	const menus: Array<Menu.Group> = [
		{ type: 'group', label: l.t('_d.docs.intro'), items: [] },
		{ type: 'group', label: l.t('_d.docs.usage'), items: [] },
		{ type: 'group', label: l.t('_d.docs.advance'), items: [] },
	];

	const append = (group: Menu.Group, r: ArrayElement<typeof routes>) => {
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

interface DocProps {
	/**
	 * 通过 import.meta.glob 加载的单一内容的多语言对象
	 */
	articles: TextFileObject;

	/**
	 * 通过 import.meta.glob 加载的单一类型的多语言对象
	 */
	types?: APIFileObject;
}

// 加载 Markdown 文档
function Doc(props: DocProps): JSX.Element {
	const l = useLocale();
	const [, origin] = useOptions();

	const route = useCurrentMatches()();
	const title = route[route.length - 1].route.info?.title;

	let articleRef!: Markdown.RootRef;
	let navRef: Nav.RootRef;

	const text = createMemo(() => {
		const articles = fileObject2Map(props.articles);
		const locales = Array.from(articles.keys());

		return articles.size > 1 // >1 表示有多种语言
			? articles.get(l.match(locales, origin.locale))
			: articles.values().next().value;
	});

	let page: Page.RootRef;

	onMount(() => {
		Code.withCopyButton(page.root());
	});

	const components = createMemo(() => {
		if (!props.types || Object.keys(props.types).length === 0) {
			return;
		}

		const typeObj = fileObject2Map(props.types);
		const locales = Array.from(typeObj.keys());

		const ret: Array<Type> =
			typeObj.size > 1 // >1 表示有多种语言
				? typeObj.get(l.match(locales, origin.locale))
				: typeObj.values().next().value;

		const obj: Markdown.RootProps['components'] = {};
		ret.forEach(t => {
			obj[`${t.pkg}%${t.name}`] = () => <APIDoc api={t} />;
		});
		return obj;
	});

	return (
		<Page.Root ref={el => (page = el)} title={title} class={styles.docs}>
			<Markdown.Root
				class={styles.doc}
				ref={el => (articleRef = el)}
				text={text()}
				components={components()}
				onComplete={() => navRef.refresh()}
			/>
			<Nav.Root
				minHeaderCount={5}
				class={styles.nav}
				ref={el => (navRef = el)}
				target={articleRef.root()}
				query="h2,h3,h4,h5,h6"
			/>
		</Page.Root>
	);
}

/**
 * 提供了文档浏览的路由定义
 */
export function buildRoute(prefix: string, setDrawer: Setter<Drawer.RootRef | undefined>): RouteDefinition {
	return {
		path: prefix,
		component: (props: ParentProps) => {
			const l = useLocale();
			let menuRef: Menu.RootRef;

			let ref: Drawer.RootRef;
			onMount(() => {
				setDrawer(ref);
				menuRef.scrollSelectedIntoView();
			});
			onCleanup(() => setDrawer(undefined));

			return (
				<Drawer.Root
					initValue
					floating={floatingWidth}
					ref={el => (ref = el)}
					palette="secondary"
					mainClass={joinClass('surface')}
					main={props.children}
				>
					<Menu.Root ref={el => (menuRef = el)} class="min-w-60" layout="inline" items={buildMenus(l, prefix)} />
				</Drawer.Root>
			);
		},
		children: routes,
	};
}
