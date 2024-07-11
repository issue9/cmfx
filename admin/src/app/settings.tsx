// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { FieldAccessor, XDivider, XRadioGroup } from '@/components';
import { useApp } from './context';
import { Mode } from './options';

export default function() {
    const ctx = useApp();
    const modeFA = FieldAccessor<Mode>('mode', 'system');
    const colorFA = FieldAccessor<string|undefined>('color', undefined);

    return <div class="p-4 min-w-60 h-full scheme--secondary bg-[var(--bg)] text-[var(--text)]">
        <XRadioGroup vertical accessor={modeFA}
            label={<div class="flex flex-col mb-1">
                <p class="text-lg icon-container">
                    <span class="material-symbols-outlined mr-2">settings_night_sight</span>{ ctx.t('_internal.theme.mode') }
                </p>
                <span class="text-sm text-left">{ ctx.t('_internal.theme.modeDesc') }</span>
            </div>}
            options={[
                ['system', <><span class="material-symbols-outlined mr-2">brightness_6</span>{ctx.t('_internal.theme.system')}</>],
                ['dark', <><span class="material-symbols-outlined mr-2">dark_mode</span>{ctx.t('_internal.theme.dark')}</>],
                ['light', <><span class="material-symbols-outlined mr-2">light_mode</span>{ctx.t('_internal.theme.light')}</>]
            ]}
        />

        <XDivider />

        <XRadioGroup accessor={colorFA}
            icon = {false}
            label={<div class="flex flex-col mb-1">
                <p class="text-lg icon-container">
                    <span class="material-symbols-outlined mr-2">palette</span>{ ctx.t('_internal.theme.color') }
                </p>
                <span class="text-sm text-left">{ ctx.t('_internal.theme.colorDesc') }</span>
            </div>}
            options={[
                ['#ccc', '#CCC'],
                ['#aaa', '#AAA']
            ]}
        />

        <XDivider pos='start'>
            <span class="material-symbols-outlined mr-2">translate</span>{ ctx.t('_internal.locale.locale') }
        </XDivider>
        abc
    </div >;
}
