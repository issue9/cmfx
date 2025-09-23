// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Choice, createBytesFormatter, Description, Divider, fieldAccessor,
    joinClass, Mode, Page, RadioGroup, SchemeSelector, Timezone, useComponents
} from '@cmfx/components';
import { DisplayStyle, formatDuration, Locale } from '@cmfx/core';
import { JSX, Show } from 'solid-js';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconPalette from '~icons/material-symbols/palette';
import IconSettings from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';
import IconTimezone from '~icons/mdi/timezone';

import { useLocale } from '@/context';
import styles from './style.module.css';

/**
 * 设置页面
 */
export function Settings(): JSX.Element {
    const [, act, opt] = useComponents();
    const l = useLocale();

    const modeFA = fieldAccessor<Mode>('mode', opt.mode ?? 'system');
    modeFA.onChange(m => { act.switchMode(m); });

    const localeFA = fieldAccessor<string>('locale', Locale.matchLanguage(opt.locale));
    localeFA.onChange((v) => { act.switchLocale(v); });

    const unitFA = fieldAccessor<DisplayStyle>('unit', opt.displayStyle);
    unitFA.onChange((v) => { act.switchDisplayStyle(v); });

    return <Page title='_p.current.settings' class={joinClass(undefined, 'max-w-sm', styles.settings)}>
        <Description icon={/*@once*/<IconSettings />} title={l.t('_p.settings.mode')!}>
            {l.t('_p.settings.modeDesc')!}
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={modeFA} block={/*@once*/false}
            options={/*@once*/[
                { value: 'system', label: l.t('_p.settings.system') },
                { value: 'dark', label: l.t('_p.settings.dark') },
                { value: 'light', label: l.t('_p.settings.light') }
            ]}
        />

        <Show when={opt.schemes && opt.scheme}>
            <Divider />

            <Description icon={/*@once*/<IconPalette />} title={l.t('_p.settings.color')!}>
                {l.t('_p.settings.colorDesc')!}
            </Description>

            <SchemeSelector schemes={opt.schemes!} value={opt.scheme!} onChange={val => act.switchScheme(val)} />
        </Show>

        <Divider />

        <Description icon={/*@once*/<IconTranslate />} title={l.t('_p.settings.locale')!}>
            {l.t('_p.settings.localeDesc')!}
        </Description>

        <div class="w-60">
            <Choice accessor={localeFA} options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))} />
        </div>

        <Divider />

        <Description icon={/*@once*/<IconFormat />} title={l.t('_p.settings.displayStyle')!}>
            {l.t('_p.settings.displayStyleDesc')!}
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={unitFA} block={/*@once*/false} options={/*@once*/[
            { value: 'narrow', label: l.t('_p.settings.narrow') },
            { value: 'short', label: l.t('_p.settings.short') },
            { value: 'full', label: l.t('_p.settings.long') },
        ]} />

        <div class="ms-1 ps-2 border-l-2 border-palette-bg-low">
            <p>{l.datetimeFormat().format(new Date())}</p>
            <p>{formatDuration(l.durationFormat(), 1111111223245)}</p>
            <p>{createBytesFormatter(l)(1111223245)}</p>
        </div>

        <Divider />

        <Description icon={/*@once*/<IconTimezone />} title={l.t('_p.settings.timezone')!}>
            {l.t('_p.settings.timezoneDesc')!}
        </Description>

        <Timezone value={opt.timezone} onChange={v => { act.switchTimezone(v); }} />
    </Page>;
}
