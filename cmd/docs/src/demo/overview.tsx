// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Card, cloneElement, Page, useLocale } from '@cmfx/components';
import { A } from '@solidjs/router';
import { For, JSX } from 'solid-js';

import { buildMenus } from './routes';
import styles from './style.module.css';

export default function Overview(prefix: string): JSX.Element {
    const l = useLocale();
    const items = buildMenus(l, prefix);

    return <Page class={styles.overview} title={l.t('_d.demo.overview')}>
        <For each={items.filter(item => item.type === 'group')}>
            {group =>
                <fieldset class={styles.group}>
                    <legend>{group.label} <span>{ group.items.length }</span></legend>
                    <For each={group.items}>
                        {item =>
                            <Card header={<A href={(item as any).value}>{(item as any).label}</A>}>
                                <div class={styles.icon}>{cloneElement((item as any).prefix)}</div>
                            </Card>
                        }
                    </For>
                </fieldset>
            }
        </For>
    </Page>;
}
