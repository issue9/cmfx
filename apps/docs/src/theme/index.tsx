// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Drawer } from '@cmfx/components';
import type { RouteDefinition } from '@solidjs/router';
import type { Setter } from 'solid-js';

import { Builder } from './builder';

/**
 * 生成路由项
 */
export function buildRoute(path: string, setDrawer: Setter<Drawer.Ref | undefined>): RouteDefinition {
	return {
		path: path,
		component: () => <Builder setDrawer={setDrawer} />,
	};
}
