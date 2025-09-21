// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Label, Page, useLocale } from '@cmfx/components';
import type { Package } from '@cmfx/vite-plugin-about';
import { For, JSX, Show, VoidComponent } from 'solid-js';
import IconAutomation from '~icons/material-symbols/automation';
import IconFolderCode from '~icons/material-symbols/folder-code';
import IconHost from '~icons/material-symbols/host';

import styles from './style.module.css';

interface Props {
    /**
     * 自定义关于页面的描述信息
     */
    description?: VoidComponent;
}

/**
 * 关于页面
 *
 * 此页面需要 {@link https://www.npmjs.com/@cmfx/vite-plugin-about|vite-plugin-about} 插件生成数据。
 */
export function About(props: Props): JSX.Element {
    const l = useLocale();
    const f = __CMFX_ABOUT__;

    return <Page title='_p.system.about' class={styles.about}>
        {props.description && props.description({})}

        <Show when={f.serverDependencies}>
            {renderPackage(l.t('_p.system.srvDeps'), f.serverDependencies, <IconHost />)}
        </Show>

        <Show when={f.dependencies}>
            {renderPackage(l.t('_p.system.prodDeps'), f.dependencies, <IconAutomation />)}
        </Show>

        <Show when={f.devDependencies}>
            {renderPackage(l.t('_p.system.devDeps'), f.devDependencies, <IconFolderCode />)}
        </Show>
    </Page>;
}

function renderPackage(title: string, pkgs: Array<Package>, icon?: JSX.Element): JSX.Element {
    return <fieldset class="palette--tertiary">
        <Label class='px-1 text-lg' icon={icon} tag='legend'>{title}</Label>
        <For each={pkgs}>
            {(item) => (
                <div class={styles.item}>
                    <span>{item.name}</span>
                    <span class={styles.version}>{item.version}</span>
                </div>
            )}
        </For>
    </fieldset>;
}
