// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { IconSymbol, Label, Page, useLocale } from '@cmfx/components';
import type { Package } from '@cmfx/vite-plugin-about';
import { For, JSX, Show, VoidComponent } from 'solid-js';

interface Props {
    /**
     * 自定义关于页面的描述信息
     */
    description?: VoidComponent;
}

/**
 * 关于页面
 *
 * 此页面需要 {@link @cmfx/vite-plugin-about} 插件生成数据。
 */
export function About(props: Props): JSX.Element {
    const l = useLocale();
    const f = __CMFX_ABOUT__;

    return <Page title='_p.system.about' class="p--about">
        {props.description && props.description({})}

        <Show when={f.serverDependencies}>
            {renderPackage(l.t('_p.system.srvDeps'), f.serverDependencies, 'host')}
        </Show>

        <Show when={f.dependencies}>
            {renderPackage(l.t('_p.system.prodDeps'), f.dependencies, 'automation')}
        </Show>

        <Show when={f.devDependencies}>
            {renderPackage(l.t('_p.system.devDeps'), f.devDependencies, 'folder_code')}
        </Show>
    </Page>;
}

function renderPackage(title: string, pkgs: Array<Package>, icon?: IconSymbol): JSX.Element {
    return <fieldset class="palette--tertiary">
        <Label class='px-1 text-lg' icon={icon} tag='legend'>{title}</Label>
        <For each={pkgs}>
            {(item) => (
                <div class="item">
                    <span>{item.name}</span>
                    <span class="version">{item.version}</span>
                </div>
            )}
        </For>
    </fieldset>;
}