// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Menu, Nav, Page, useLocale } from '@cmfx/components';
import type { ArrayElement, Locale } from '@cmfx/core';
import { joinClass } from '@cmfx/themes';
import { type RouteDefinition, useCurrentMatches } from '@solidjs/router';
import { type JSX, onCleanup, onMount, type ParentProps, type Setter } from 'solid-js';

import { LocalizedMDXDoc, type LocalizedMDXDocProps } from '@docs/mdx';
import styles from './style.module.css';

const kinds = ['intro', 'usage', 'advance'] as const;

type Kind = (typeof kinds)[number];

// 定义了所有文章的路由
//
// title: 在翻译文件中对应的翻译项 id；
// kind 表示文章类型，用于区分不同类型的文档；
const routes: Array<RouteDefinition & { kind: Kind }> = [
	{
		kind: 'intro',
		path: ['', 'intro/readme'],
		info: { title: '_d.docs.intro' },
		component: () => <MDXDoc docs={import.meta.glob('./intro/README.md', { eager: true, import: 'default' })} />,
	},
	{
		kind: 'intro',
		path: 'intro/changelog',
		info: { title: '_d.docs.changelog' },
		component: () => <MDXDoc docs={import.meta.glob('./intro/CHANGELOG.md', { eager: true, import: 'default' })} />,
	},

	//////////////////// usage

	{
		kind: 'usage',
		path: 'usage/install',
		info: { title: '_d.docs.install' },
		component: () => <MDXDoc docs={import.meta.glob('./usage/install.*.mdx', { eager: true, import: 'default' })} />,
	},
	{
		kind: 'usage',
		path: 'usage/platform',
		info: { title: '_d.docs.platform' },
		component: () => <MDXDoc docs={import.meta.glob('./usage/platform.*.mdx', { eager: true, import: 'default' })} />,
	},
	{
		kind: 'usage',
		path: 'usage/svg',
		info: { title: '_d.docs.svg' },
		component: () => <MDXDoc docs={import.meta.glob('./usage/svg.*.mdx', { eager: true, import: 'default' })} />,
	},
	{
		kind: 'usage',
		path: 'usage/theme',
		info: { title: '_d.docs.theme' },
		component: () => <MDXDoc docs={import.meta.glob('./usage/theme.*.mdx', { eager: true, import: 'default' })} />,
	},
	{
		kind: 'usage',
		path: 'usage/faq',
		info: { title: '_d.docs.faq' },
		component: () => <MDXDoc docs={import.meta.glob('./usage/faq.*.mdx', { eager: true, import: 'default' })} />,
	},

	//////////////////// advance

	{
		kind: 'advance',
		path: 'advance/locale',
		info: { title: '_d.docs.locale' },
		component: () => <MDXDoc docs={import.meta.glob('./advance/locale.*.mdx', { eager: true, import: 'default' })} />,
	},
	{
		kind: 'advance',
		path: 'advance/validator',
		info: { title: '_d.docs.validator' },
		component: () => (
			<MDXDoc docs={import.meta.glob('./advance/validator.*.mdx', { eager: true, import: 'default' })} />
		),
	},
	{
		kind: 'advance',
		path: 'advance/error',
		info: { title: '_d.docs.error' },
		component: () => <MDXDoc docs={import.meta.glob('./advance/error.*.mdx', { eager: true, import: 'default' })} />,
	},
	{
		kind: 'advance',
		path: 'advance/custom-theme',
		info: { title: '_d.docs.customTheme' },
		component: () => (
			<MDXDoc docs={import.meta.glob('./advance/custom-theme.*.mdx', { eager: true, import: 'default' })} />
		),
	},
	{
		kind: 'advance',
		path: 'advance/plugins',
		info: { title: '_d.docs.plugins' },
		component: () => <MDXDoc docs={import.meta.glob('./advance/plugins.*.mdx', { eager: true, import: 'default' })} />,
	},
] as const;

// 生成 Drawer 组件的侧边栏菜单
export function buildMenus(l: Locale, prefix: string): Array<Menu.Item> {
	if (!prefix.endsWith('/')) {
		prefix += '/';
	}

	const menus: Array<Menu.ItemGroup> = [
		{ type: 'group', label: l.t('_d.docs.intro'), items: [] },
		{ type: 'group', label: l.t('_d.docs.usage'), items: [] },
		{ type: 'group', label: l.t('_d.docs.advance'), items: [] },
	];

	const append = (group: Menu.ItemGroup, r: ArrayElement<typeof routes>) => {
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

interface MDXDocProps {
	docs: LocalizedMDXDocProps['docs'];
}

function MDXDoc(props: MDXDocProps): JSX.Element {
	const route = useCurrentMatches()();
	const title = route[route.length - 1].route.info?.title;

	let articleRef!: HTMLElement;
	let navRef: Nav.Ref;

	return (
		<Page title={title} class={styles.docs}>
			<LocalizedMDXDoc
				class={styles.doc}
				onSwitch={() => navRef?.refresh()}
				ref={el => (articleRef = el)}
				docs={props.docs}
			/>
			<Nav
				minHeaderCount={5}
				class={styles.nav}
				ref={el => (navRef = el)}
				target={articleRef}
				query=":is(h2,h3,h4):not(table *)"
			/>
		</Page>
	);
}

/**
 * 提供了文档浏览的路由定义
 */
export function buildRoute(
	prefix: string,
	setDrawer: Setter<Drawer.Ref | undefined>,
	floating: Drawer.Props['floating'],
): RouteDefinition {
	if (!prefix.endsWith('/')) {
		prefix += '/';
	}

	return {
		path: prefix,
		component: (props: ParentProps) => {
			const l = useLocale();
			let menuRef: Menu.Ref;

			let ref: Drawer.Ref;
			onMount(() => {
				setDrawer(ref);
				menuRef.scrollSelectedIntoView();
			});
			onCleanup(() => setDrawer(undefined));

			return (
				<Drawer
					initValue
					floating={floating}
					ref={el => (ref = el)}
					palette="secondary"
					mainClass={joinClass('surface')}
					main={props.children}
				>
					<Menu ref={el => (menuRef = el)} class="min-w-60" layout="inline" items={buildMenus(l, prefix)} />
				</Drawer>
			);
		},
		children: routes,
	};
}
