// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Divider, FieldAccessor, RadioGroup } from '@/components';
import { Locale, locales, names } from '@/locales';
import { useApp } from './context';
import { Mode } from './options';

export default function() {
    const ctx = useApp();

    const modeFA = FieldAccessor<Mode>('mode', 'system');

    const colorFA = FieldAccessor<string|undefined>('color', undefined);

    const localeFA = FieldAccessor<Array<Locale>>('locale', [locales[0]], (v)=>{
        ctx.locale = v[0];
    });

    return <div class="p-4 min-w-60 h-full bg-[var(--bg)] text-[var(--text)]">
        <RadioGroup vertical accessor={modeFA}
            label={<div class="flex flex-col mb-1">
                <p class="icon-container">
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

        <Divider />

        <RadioGroup accessor={colorFA}
            icon = {false}
            label={<div class="flex flex-col mb-1">
                <p class="icon-container">
                    <span class="material-symbols-outlined mr-2">palette</span>{ ctx.t('_internal.theme.color') }
                </p>
                <span class="text-sm text-left">{ ctx.t('_internal.theme.colorDesc') }</span>
            </div>}
            options={[
                ['#ccc', '#CCC'],
                ['#aaa', '#AAA']
            ]}
        />

        <Divider />

        <div class="flex flex-col">
            <p class="icon-container">
                <span class="material-symbols-outlined mr-2">translate</span>{ ctx.t('_internal.locale.locale') }
            </p>
            <span class="text-sm text-left">{ ctx.t('_internal.locale.localeDesc') }</span>
        </div>
        <Choice accessor={localeFA} options={names} />
    </div>;
}
