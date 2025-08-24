// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Card, MenuItemGroup, useLocale } from '@cmfx/components';
import { A } from '@solidjs/router';
import { For, JSX } from 'solid-js';

import { buildMenus } from './routes';
import styles from './style.module.css';

export default function(prefix: string): JSX.Element {
    const l = useLocale();
    const items = buildMenus(l, prefix);

    return <div class={styles.overview}>
        <For each={items.filter(item => item.type === 'group')}>
            {(group: MenuItemGroup<string>) =>
                <fieldset class={styles.group}>
                    <legend>{group.label} <span>{ group.items.length }</span></legend>
                    <For each={group.items}>
                        {item =>
                            <Card header={<A href={(item as any).value}>{(item as any).label}</A>}>
                                <div class={styles.icon}>{(item as any).icon()}</div>
                            </Card>
                        }
                    </For>
                </fieldset>
            }
        </For>
    </div>;
}
