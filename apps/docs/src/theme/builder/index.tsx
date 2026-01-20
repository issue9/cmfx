// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, DrawerRef, joinClass, ObjectAccessor, Scheme, useLocale, useOptions, useTheme } from '@cmfx/components';
import { RouteDefinition } from '@solidjs/router';
import { createEffect, onCleanup, onMount, Setter } from 'solid-js';
import { unwrap } from 'solid-js/store';

import { floatingWidth } from '@docs/utils/options';
import { Demo } from './demo';
import { params } from './params';
import styles from './style.module.css';
import { convertSchemeVar2Color } from './utils';

/**
 * 生成路由项
 */
export function buildRoute(path: string, setDrawer: Setter<DrawerRef | undefined>): RouteDefinition {
    return {
        path: path,
        component: () => {
            let drawerRef: DrawerRef;
            onMount(() => { setDrawer(drawerRef); });
            onCleanup(() => setDrawer(undefined));

            const l = useLocale();
            const [act] = useOptions();

            const t = useTheme();
            const schemeFA = new ObjectAccessor<Scheme>(convertSchemeVar2Color(unwrap(t.scheme)!));

            createEffect(() => { act.setTitle(l.t('_d.theme.builder')); });

            return <Drawer class={styles.builder} floating={floatingWidth} ref={el => {
                drawerRef = el;
                el.main().style.overflow = 'unset';
            }} palette='secondary' mainClass={joinClass('surface')} main={<Demo s={schemeFA} />}
            >
                {params(schemeFA)}
            </Drawer>;
        }
    };
}
