// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { RouteDefinition } from '@solidjs/router';
import { onMount, onCleanup, Setter, createEffect } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { Drawer, DrawerRef, ObjectAccessor, Scheme, useComponents, useLocale, useTheme } from '@cmfx/components';

import { Demo } from './demo';
import { params } from './params';
import { Ref, convertSchemeVar2Color } from './utils';
import styles from './style.module.css';

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
            const [, act] = useComponents();

            const t = useTheme();
            const schemeFA = new ObjectAccessor<Scheme>(convertSchemeVar2Color(unwrap(t.scheme)!));

            createEffect(() => { act.setTitle(l.t('_d.theme.builder')); });

            const ref: Ref = {
                export: (): Scheme => {
                    return schemeFA.object();
                },
                apply: () => {
                    act.switchScheme(schemeFA.object());
                },
            };

            return <Drawer class={styles.builder} floating='md' ref={el => drawerRef = el}
                palette='secondary' mainPalette='surface' main={<Demo s={schemeFA} />}
            >
                {params(schemeFA, ref)}
            </Drawer>;
        }
    };
}
